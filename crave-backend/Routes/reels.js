// routes/reels.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Reel = require('../models/Reel');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer to save files to the 'temp' directory
const upload = multer({ dest: 'temp/' });

// --- POST /reels (Upload a new video) ---
// Note: 'video' is the name of the form-data field the frontend will send
router.post('/', protectRoute, upload.single('video'), async (req, res) => {
  try {
    // 1. Ensure a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { restaurant, dishName, price, lat, lng } = req.body;

    // 2. Upload to Cloudinary
    // We specify resource_type: "video" so Cloudinary knows how to encode it
    const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      folder: 'crave_reels' 
    });

    // 3. Delete the temporary file from our local server to free up space
    fs.unlinkSync(req.file.path);

    // 4. Save to MongoDB using our geospatial schema
    const newReel = new Reel({
      creator: req.user._id, // Got this from the protectRoute middleware!
      videoUrl: cloudResponse.secure_url,
      restaurant,
      dishName,
      price,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)] // [Longitude, Latitude]
      }
    });

    await newReel.save();

    res.status(201).json({
      message: 'Reel uploaded successfully',
      reel: newReel
    });

  } catch (error) {
    console.error('Upload Error:', error);
    // Cleanup local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload reel' });
  }
});

module.exports = router;