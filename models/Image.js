// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  fundRaisingStartDate: { type: Date },
  fundRaisingEndDate: { type: Date },
  donationGoal: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
