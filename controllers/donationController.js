const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');

// Get all donations for a user
const getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user.id });
  res.status(200).json(donations);
});

// Create a new donation
const createDonation = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    email,
    phone,
    amount,
  } = req.body;

  if (!firstName || !lastName || !address1 || !city || !state || !zip || !email || !phone || !amount) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const donation = await Donation.create({
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    email,
    phone,
    donation: [{ amount }],
    user: req.user.id,
  });

  // res.status(201).json(donation);
  if (donation) {
    res.status(201).json({
      success: true,
      msg: "Successfully Added Donation",
      data: donation,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Donation data");
  }
});

// Get monthly donation totals
const getMonthlyDonations = asyncHandler(async (req, res) => {
  const monthlyDonations = await Donation.aggregate([
    { $match: { user: req.user._id } },
    { $unwind: "$donation" },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$donation.amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.status(200).json(monthlyDonations);
});

// Update a donation
const updateDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.donationId);

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Check if the user owns this donation
  if (donation.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedDonation = await Donation.findByIdAndUpdate(
    req.params.donationId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedDonation);
});

// Delete a donation
const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.donationId);

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Check if the user owns this donation
  if (donation.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await donation.remove();

  res.status(200).json({ id: req.params.donationId });
});

module.exports = {
  getDonations,
  createDonation,
  getMonthlyDonations,
  updateDonation,
  deleteDonation,
};
