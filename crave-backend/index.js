// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Reel = require('./models/Reel');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the Matrix (MongoDB)'))
  .catch(err => console.error('Database connection failed', err));

// The Core API Route
app.get('/api/feed', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // Default 5km radius (approx 3 miles)

    if (!lat || !lng) {
      return res.status(400).json({ error: "Location is required" });
    }

    // The Magic Geospatial Query
    const localFood = await Reel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)] // Again, Longitude first!
          },
          $maxDistance: parseInt(radius) // Distance in meters
        }
      }
    }).limit(10); // Only send 10 videos at a time to save bandwidth

    // Format data to match our React frontend expectations
    const formattedData = localFood.map(reel => ({
      id: reel._id,
      restaurant: reel.restaurant,
      dishName: reel.dishName,
      price: reel.price,
      videoUrl: reel.videoUrl
    }));

    res.json(formattedData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server crashed while looking for food" });
  }
});

app.listen(3000, () => console.log('API running on port 3000'));