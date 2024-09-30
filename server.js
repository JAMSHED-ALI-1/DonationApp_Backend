const express = require('express');
const connectDB = require('./config/db');
const formData = require('express-form-data');
const cors = require('cors');
require('colors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes.js');
const newsRoutes = require('./routes/newsRoute.js');
const categoryRoutes = require('./routes/categoryRoute');


const morgan = require('morgan');



connectDB();

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000', // Update to your frontend's URL when deployed
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

app.get('*', function(req, res){
  res.status(404).json({
    msg: "Api path not found."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red,
  ),
);



// hosted server https://news-app-native.herokuapp.com/