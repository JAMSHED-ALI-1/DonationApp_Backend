const express = require('express');
const connectDB = require('./config/db');
const formData = require('express-form-data');
const cors = require('cors');
require('colors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes.js');
const newsRoutes = require('./routes/newsRoute.js');
const categoryRoutes = require('./routes/categoryRoute');
const donationRoute = require('./routes/DonationRoute');
const campaignRoutes = require('./routes/campaignRoutes');
const morgan = require('morgan');



connectDB();

const app = express();


const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));


app.use(formData.parse());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));


app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/donations', donationRoute);
app.use('/api/campaigns', campaignRoutes);

app.get('*', function(req, res){
  res.status(404).json({
    msg: "Api path not found."
  });
});
// app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red,
  ),
);


// const express = require('express');
// const mongoose = require('mongoose');
// const fs = require('fs');
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// const cloudinary = require('cloudinary').v2;
// require('dotenv').config();

// // Initialize Express app
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'dvymgpgnt',
//   api_key: '797527593986259',
//   api_secret: 'kfjxuM1XT39cN9V6pJV_lfkZnkQ'
// });

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Create uploads directory if it doesn't exist
//     if (!fs.existsSync('./uploads')) {
//       fs.mkdirSync('./uploads');
//     }
//     cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     const uniqueFilename = `${uuidv4()}-${file.originalname}`;
//     cb(null, uniqueFilename);
//   }
// });

// // Configure Multer upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // Accept only images
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'));
//     }
//   }
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });

// // Define Image model
// const Image = mongoose.model('Image', {
//   image_url: { type: String, required: true },
//   author: { type: String, required: true},
//   title: { type: String,required: true },
//   content: { type: String, required: true },
//   category: { type: String, required: true },
//   fundRaisingStartDate: { type: String, },
//   fundRaisingEndDate: { type: String,  },
//   donationGoal: { type: Number, required: true },
//   created_at: { type: Date, default: Date.now }
// });

// // Upload endpoint
// app.post('/upload', upload.single('imageUrl'), async (req, res) => {
//   try {
//     // Check if file exists
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Extract additional fields from request body
//     const { author, title, content, category, fundRaisingStartDate, fundRaisingEndDate, donationGoal } = req.body;

//     // Validate required fields
//     // if (!author || !title || !content || !category || !fundRaisingStartDate || !fundRaisingEndDate || !donationGoal) {
//     //   return res.status(400).json({ error: 'All fields are required' });
//     // }

//     // Upload to Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
//       folder: 'uploads',
//       resource_type: 'auto'
//     });

//     // Save to MongoDB
//     const image = new Image({
//       image_url: cloudinaryResponse.secure_url,
//       author,
//       title,
//       content,
//       category,
//       fundRaisingStartDate: new Date(fundRaisingStartDate),
//       fundRaisingEndDate: new Date(fundRaisingEndDate),
//       donationGoal: Number(donationGoal)
//     });
//     await image.save();

//     // Clean up: Delete local file
//     fs.unlink(req.file.path, (err) => {
//       if (err) {
//         console.error('Error deleting local file:', err);
//       }
//     });

//     // Success response
//     res.status(200).json({
//       message: 'File uploaded successfully',
//       data: {
//         image_url: cloudinaryResponse.secure_url,
//         public_id: cloudinaryResponse.public_id
//       }
//     });
// console.log(res)
//   } catch (error) {
//     // Clean up local file if exists
//     console.log(error)
//     if (req.file) {
//       fs.unlink(req.file.path, () => {});
//     }

//     console.error('Upload error:', error);
//     res.status(500).json({
//       error: 'Upload failed',
//       message: error.message
//     });
//   }
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     return res.status(400).json({
//       error: 'File upload error',
//       message: error.message
//     });
//   }
//   next(error);
// });

// // Start server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
