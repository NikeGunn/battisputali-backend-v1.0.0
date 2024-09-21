// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const firebaseAdmin = require('./config/firebase');
const redisClient = require('./config/redis');
const cloudinary = require('cloudinary').v2;
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Redis Setup
redisClient.on('connect', () => console.log('Connected to Redis'));

// Routes
app.use('/api/videos', videoRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
