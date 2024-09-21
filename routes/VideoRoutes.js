// routes/videoRoutes.js
const express = require('express');
const Video = require('../models/Video');
const upload = require('../middlewares/uploadMiddleware');
const redisClient = require('../config/redis');
const verifyToken = require('../middlewares/verifyToken');
const axios = require('axios');

const router = express.Router();

// Post Video
router.post('/', verifyToken, upload.single('video'), async (req, res) => {
    try {
        const newVideo = new Video({
            title: req.body.title,
            url: req.file.path,
            userId: req.user.uid
        });
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Videos (with Redis cache)
router.get('/', async (req, res) => {
    redisClient.get('all_videos', async (err, data) => {
        if (data) {
            return res.json(JSON.parse(data));
        } else {
            const videos = await Video.find();
            redisClient.setex('all_videos', 3600, JSON.stringify(videos));  // Cache for 1 hour
            res.json(videos);
        }
    });
});

// Hybrid Recommendation from Python
router.get('/recommendations', verifyToken, async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/recommend', { user_id: req.user.uid });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recommendations' });
    }
});


module.exports = router;
