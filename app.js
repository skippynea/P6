
// image url : https://cdn.pixabay.com/photo/2014/12/27/15/31/camera-581126_960_720.jpg

require('dotenv').config();
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

// const stuffRoutes = require('./routes/stuff');
// const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());


mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });
 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// app.use ('/images', express.static(path.join(__dirname, 'images')));

// app.use('/api/stuff', stuffRoutes);
// app.use('/api/auth', userRoutes);

module.exports = app;



