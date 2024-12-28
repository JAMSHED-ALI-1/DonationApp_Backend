const asyncHandler = require("express-async-handler");
const Campaign = require("../models/campaignModel");
const User = require("../models/userModel");
const cloudinary = require('../utils/cloudnary');
const Image = require('../models/Image');
const fs = require('fs').promises;

// Create a new campaign with image upload


// Create a new campaign with image upload
const AddCampaign = asyncHandler(async (req, res) => {
  try {
    // Check if request contains a file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Validate other required fields
    const {
      author,
      title,
      content,
      category,
      fundRaisingStartDate,
      fundRaisingEndDate,
      donationGoal
    } = req.body;

    if (!author || !title || !content || !category || 
        !fundRaisingStartDate || !fundRaisingEndDate || !donationGoal) {
      // Clean up uploaded file if validation fails
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Upload image to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'campaigns',
      resource_type: 'auto',
    });

    const image = new Image({
      image_url: cloudinaryResponse.secure_url,
      author,
      title,
      content,
      category,
      fundRaisingStartDate: new Date(fundRaisingStartDate),
      fundRaisingEndDate: new Date(fundRaisingEndDate),
      donationGoal: Number(donationGoal),
    });
    await image.save();

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });

  } catch (error) {
    // Clean up uploaded file if something goes wrong
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    console.error('Campaign creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating campaign',
      error: error.message
    });
  }
});

// Get campaign by ID
const GetCampaignById = asyncHandler(async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('category')
      .populate('donors.user', 'name email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaign",
      error: error.message
    });
  }
});

// Donate to a campaign
const DonateToCampaign = asyncHandler(async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "User ID and donation amount are required"
      });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    if (campaign.fundRaisingEndDate < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Fundraising for this campaign has ended"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Calculate total donation from multiple amounts
    const totalDonation = amount.toString()
      .split('+')
      .reduce((sum, value) => sum + parseFloat(value.trim()), 0);

    if (isNaN(totalDonation) || totalDonation <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation amount"
      });
    }

    // Update campaign
    campaign.donationReceived += totalDonation;
    campaign.donors.push({
      user: userId,
      amount: totalDonation,
      donatedAt: new Date()
    });

    await campaign.save();

    res.status(200).json({
      success: true,
      message: "Donation successful",
      data: {
        campaignId: campaign._id,
        donationAmount: totalDonation,
        donor: {
          name: user.name,
          email: user.email
        },
        currentTotal: campaign.donationReceived
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Donation failed",
      error: error.message
    });
  }
});

// Get campaign donations
const GetCampaignDonations = asyncHandler(async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('donors.user', 'name email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    const donations = campaign.donors.map(donor => ({
      userId: donor.user._id,
      name: donor.user.name,
      email: donor.user.email,
      amount: donor.amount,
      donatedAt: donor.donatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        campaignName: campaign.title,
        totalDonations: campaign.donationReceived,
        donationsCount: donations.length,
        donations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching donations",
      error: error.message
    });
  }
});

// Get all campaigns
const GetAllCampaigns = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status,
      sort = '-addedAt' 
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) {
      const now = new Date();
      switch (status) {
        case 'active':
          query.fundRaisingEndDate = { $gt: now };
          break;
        case 'ended':
          query.fundRaisingEndDate = { $lte: now };
          break;
      }
    }

    const campaigns = await Campaign.find(query)
      .populate('category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Campaign.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        campaigns,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCampaigns: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
      error: error.message
    });
  }
});

// Delete campaign
const DeleteCampaign = asyncHandler(async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    // Delete image from cloudinary if exists
    if (campaign.imagePublicId) {
      await cloudinary.uploader.destroy(campaign.imagePublicId);
    }

    await Campaign.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting campaign",
      error: error.message
    });
  }
});

module.exports = {
  AddCampaign,
  GetCampaignById,
  DonateToCampaign,
  GetAllCampaigns,
  DeleteCampaign,
  GetCampaignDonations
};