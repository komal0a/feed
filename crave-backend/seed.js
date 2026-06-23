// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Reel = require('./models/reel');
const User = require('./models/User');

const SAMPLE_VIDEO_URLS = [
  'https://videos.pexels.com/video-files/5975898/5975898-hd_1080_1920_30fps.mp4',
  'https://videos.pexels.com/video-files/6222167/6222167-uhd_2160_3840_24fps.mp4',
  'https://videos.pexels.com/video-files/6603834/6603834-uhd_2160_3840_25fps.mp4',
  'https://videos.pexels.com/video-files/6603822/6603822-uhd_2160_3840_25fps.mp4',
  'https://videos.pexels.com/video-files/7594023/7594023-uhd_2160_3840_24fps.mp4'
];

// Default Center: New Delhi (Connaught Place)
// Longitude: 77.2177, Latitude: 28.6304
// Remember: MongoDB ALWAYS wants [Longitude, Latitude]
const MOCK_REELS = [
  {
    restaurant: "The Spice Route",
    dishName: "Truffle Butter Chicken",
    price: "₹450",
    videoUrl: SAMPLE_VIDEO_URLS[0],
    location: {
      type: "Point",
      coordinates: [77.2177, 28.6304] // Exact center
    }
  },
  {
    restaurant: "South Indian Sizzle",
    dishName: "Cheese Burst Masala Dosa",
    price: "₹180",
    videoUrl: SAMPLE_VIDEO_URLS[1],
    location: {
      type: "Point",
      coordinates: [77.2200, 28.6320] // ~300m away
    }
  },
  {
    restaurant: "Bakehouse 44",
    dishName: "Molten Chocolate Croissant",
    price: "₹220",
    videoUrl: SAMPLE_VIDEO_URLS[2],
    location: {
      type: "Point",
      coordinates: [77.2150, 28.6280] // ~400m away
    }
  },
  {
    restaurant: "Street Bite",
    dishName: "Bombay Style Vada Pav",
    price: "₹90",
    videoUrl: SAMPLE_VIDEO_URLS[3],
    location: {
      type: "Point",
      coordinates: [77.2300, 28.6400] // ~1.5km away
    }
  },
  {
    restaurant: "Gurgaon Grills", // Outside the 5km radius!
    dishName: "Mutton Galouti Kebab",
    price: "₹550",
    videoUrl: SAMPLE_VIDEO_URLS[4],
    location: {
      type: "Point",
      coordinates: [77.0266, 28.4595] // ~25km away (Should NOT show up in default feed)
    }
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    console.log("Clearing old reels...");
    await Reel.deleteMany({}); // Wipes the collection clean

    let demoCreator = await User.findOne({ email: 'demo@crave.local' });
    if (!demoCreator) {
      demoCreator = await User.create({
        username: 'crave_demo',
        email: 'demo@crave.local',
        password: await bcrypt.hash('development-only', 10)
      });
    }

    console.log("Planting new hyper-local food...");
    await Reel.insertMany(MOCK_REELS.map(reel => ({
      ...reel,
      creator: demoCreator._id
    })));

    console.log("Database seeded! Ready for users.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
