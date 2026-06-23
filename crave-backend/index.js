require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Reel = require('./models/reel');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/Auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);

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
    let localFood = await Reel.find({
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

    // Keep development usable when the database has no reels near the user.
    if (localFood.length === 0) {
      localFood = await Reel.find({}).sort({ createdAt: -1 }).limit(10);
    }

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
