// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
cloudinary.config({
    cloud_name: 'dvymgpgnt',
    api_key: '797527593986259',
    api_secret: 'kfjxuM1XT39cN9V6pJV_lfkZnkQ'
  });

module.exports = cloudinary;
