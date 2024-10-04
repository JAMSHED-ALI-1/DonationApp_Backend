const express = require('express');
const { 
  getDonations, 
  createDonation, 
  getMonthlyDonations,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Get all donations and create a new donation
router.route('/').get(protect, getDonations);
//Post On server
router.route('/AddDonation').post(protect, createDonation)
// Get monthly donation totals
router.route('/monthly').get(protect, getMonthlyDonations);

// Update a specific donation
router.route('/:donationId').put(protect, updateDonation);

// Delete a specific donation
router.route('/:donationId').delete(protect, deleteDonation);

module.exports = router;