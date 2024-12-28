const express = require('express');
const router = express.Router();
const CampaignController = require('../controllers/campaignController');
const upload = require('../utils/multers');
// Define routes
router.post('/create', upload.single('imageUrl'),CampaignController.AddCampaign);
router.get('/:id', CampaignController.GetCampaignById);
router.post('/:id/donate', CampaignController.DonateToCampaign);
router.get('/', CampaignController.GetAllCampaigns);
router.delete('/:id', CampaignController.DeleteCampaign);
// router.delete('/compaindonation', CampaignController.GetCampaignDonations);

module.exports = router;