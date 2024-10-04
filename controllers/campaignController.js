const asyncHandler = require("express-async-handler");
const Campaign = require("../models/campaignModel");
const Donation = require("../models/Donation");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const imageToBase64 = require("image-to-base64");
const moment = require("moment");

// Create a new campaign
const AddCampaign = asyncHandler(async (req, res) => {
    const { author, title, content, url, urlToImage, category, fundRaisingStartDate, fundRaisingEndDate, donationGoal } = req.body;

    const newCampaign = new Campaign({
        author,
        title,
        content,
        url,
        urlToImage,
        category,
        fundRaisingStartDate,
        fundRaisingEndDate,
        donationGoal
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
});

// Get campaign by ID
const GetCampaignById = asyncHandler(async (req, res) => {
    const campaign = await Campaign.findById(req.params.id)
        .populate('category')
        .populate('donors.user');

    if (!campaign) {
        res.status(404).json({ message: "Campaign not found" });
        return;
    }
    res.status(200).json(campaign);
});

// Donate to a campaign
// const DonateToCampaign = asyncHandler(async (req, res) => {
//   const { userId, amount } = req.body;  // amount could be a string like "1500+2500"
//   const campaign = await Campaign.findById(req.params.id);

//   if (!campaign) {
//       return res.status(404).json({ message: "Campaign not found" });
//   }

//   // Check if the fundraising period has ended
//   if (campaign.fundRaisingEndDate < Date.now()) {
//       return res.status(400).json({ message: "Fundraising for this campaign has ended" });
//   }

//   // If amount is in the format "1500+2500", split it, convert to numbers and sum
//   const totalDonation = amount.split('+').reduce((sum, value) => sum + parseFloat(value), 0);

//   // Update the donation amount received and add the donor info
//   campaign.donationReceived += totalDonation;
//   campaign.donors.push({
//       user: userId,
//       amount: totalDonation,  // Save the summed donation
//       donatedAt: new Date()
//   });

//   // Save the updated campaign
//   const updatedCampaign = await campaign.save();
//   res.status(200).json({ message: "Donation successful", campaign: updatedCampaign });
// });
const DonateToCampaign = asyncHandler(async (req, res) => {
    const { userId, amount } = req.body;  // amount could be a string like "1500+2500"
    
    // Fetch the campaign based on the ID from the request parameters
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
  
    // Check if the fundraising period has ended
    if (campaign.fundRaisingEndDate < Date.now()) {
      return res.status(400).json({ message: "Fundraising for this campaign has ended" });
    }
  
    // Fetch user details using the userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // If amount is in the format "1500+2500", split it, convert to numbers, and sum
    const totalDonation = amount.split('+').reduce((sum, value) => sum + parseFloat(value), 0);
  
    // Update the donation amount received and add the donor info
    campaign.donationReceived += totalDonation;
    campaign.donors.push({
      user: userId,
      name: user.name,  // Adding user's name
      email: user.email,  // Adding user's email
      amount: totalDonation,  // Save the summed donation
      donatedAt: new Date()
    });
  
    // Save the updated campaign
    const updatedCampaign = await campaign.save();
  
    // Return success message and updated campaign details
    res.status(200).json({ 
      message: "Donation successful", 
      campaign: updatedCampaign, 
      donor: {
        name: user.name,
        email: user.email
      }
    });
  });
  
//get Api Donatte Compain
const GetCampaignDonations = asyncHandler(async (req, res) => {
    // Fetch the campaign based on the ID from the request parameters
    const campaign = await Campaign.findById(req.params.id);
  
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
  
    // Retrieve the donations (donors array)
    const donations = await Promise.all(
      campaign.donors.map(async (donor) => {
        const user = await User.findById(donor.user);
  
        if (!user) {
          return { 
            user: donor.user, 
            amount: donor.amount, 
            donatedAt: donor.donatedAt, 
            name: "User not found", 
            email: "User not found" 
          };
        }
  
        return {
          userId: donor.user,
          name: user.name,  // Get the name from the User model
          email: user.email,  // Get the email from the User model
          amount: donor.amount,
          donatedAt: donor.donatedAt
        };
      })
    );
  
    // Return the donations as the response
    res.status(200).json({
      message: "Donations retrieved successfully",
      campaignName: campaign.name,  // Optional: campaign name
      donations
    });
  });
  


// Convert image URL to Base64
const ConvertImageToBase64 = asyncHandler(async (req, res) => {
    const { imageUrl } = req.body;

    try {
        const base64Image = await imageToBase64(imageUrl);
        res.status(200).json({ base64Image });
    } catch (error) {
        res.status(500).json({ message: "Error converting image", error: error.message });
    }
});

// Get all campaigns
const GetAllCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find().populate('category').sort({ addedAt: -1 });
    res.status(200).json(campaigns);
});

// Delete campaign
const DeleteCampaign = asyncHandler(async (req, res) => {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!deletedCampaign) {
        res.status(404).json({ message: "Campaign not found" });
        return;
    }

    res.status(200).json({ message: "Campaign deleted successfully" });
});

// Export all the controller functions
module.exports = {
    AddCampaign,
    GetCampaignById,
    DonateToCampaign,
    ConvertImageToBase64,
    GetAllCampaigns,
    DeleteCampaign,
    // GetCampaignDonations,
};
