const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation'); // The new Donation model
const User = require('../models/userModel'); // The User model for authentication

// Controller for fetching donation data along with user info
const getDonationData = asyncHandler(async (req, res) => {
  const user = req.user; // Assuming req.user contains the logged-in user information
  const donations = await Donation.find({ user: user._id });

  if (!donations) {
    return res.status(404).json({ message: 'No donations found for this user.' });
  }

  // Sending user info and donations as a response
  res.status(200).json({
    name: user.name,
    email: user.email,
    token: req.token, // Assuming the token is available in req.token
    donations,
  });
});

module.exports = { getDonationData };
