const express = require('express');
const router = express.Router();
const CampaignController = require('../controllers/campaignController');

// Define routes
router.post('/create', CampaignController.AddCampaign);
router.get('/:id', CampaignController.GetCampaignById);
router.post('/:id/donate', CampaignController.DonateToCampaign);
router.post('/convert-image', CampaignController.ConvertImageToBase64);
router.get('/', CampaignController.GetAllCampaigns);
router.delete('/:id', CampaignController.DeleteCampaign);
// router.delete('/compaindonation', CampaignController.GetCampaignDonations);

module.exports = router;
