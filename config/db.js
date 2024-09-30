// const mongoose = require('mongoose');

// const connectDB = async () => {
//   const conn = await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   });

//   console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
         console.log(uri) 
        
        const connectionInstance = await mongoose.connect(uri);
        // Removed deprecated options
        
        console.log(`\nMongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('Connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
