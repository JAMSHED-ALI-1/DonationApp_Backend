const express = require('express');
const { getDonationData } = require('../controllers/donationController');
const protect = require('../middleware/authMiddleware.js')// Auth middleware to protect routes
const router = express.Router();

router.get('/', protect, getDonationData); // Protect ensures the user is authenticated

module.exports = router;
