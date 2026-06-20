// seed.js
require('dotenv').config();
console.log("MONGO_URI =", process.env.MONGO_URI);
const mongoose = require('mongoose');
const Reel = require('./models/Reel');

// Default Center: New Delhi (Connaught Place)
// Longitude: 77.2177, Latitude: 28.6304
// Remember: MongoDB ALWAYS wants [Longitude, Latitude]
const MOCK_REELS = [
  {
    restaurant: "The Spice Route",
    dishName: "Truffle Butter Chicken",
    price: "₹450",
    videoUrl: "/video1.mp4",
    location: {
      type: "Point",
      coordinates: [77.2177, 28.6304] // Exact center
    }
  },
  {
    restaurant: "South Indian Sizzle",
    dishName: "Cheese Burst Masala Dosa",
    price: "₹180",
    videoUrl: "/video2.mp4",
    location: {
      type: "Point",
      coordinates: [77.2200, 28.6320] // ~300m away
    }
  },
  {
    restaurant: "Bakehouse 44",
    dishName: "Molten Chocolate Croissant",
    price: "₹220",
    videoUrl: "/video1.mp4",
    location: {
      type: "Point",
      coordinates: [77.2150, 28.6280] // ~400m away
    }
  },
  {
    restaurant: "Street Bite",
    dishName: "Bombay Style Vada Pav",
    price: "₹90",
    videoUrl: "/video2.mp4",
    location: {
      type: "Point",
      coordinates: [77.2300, 28.6400] // ~1.5km away
    }
  },
  {
    restaurant: "Gurgaon Grills", // Outside the 5km radius!
    dishName: "Mutton Galouti Kebab",
    price: "₹550",
    videoUrl: "/video1.mp4",
    location: {
      type: "Point",
      coordinates: [77.0266, 28.4595] // ~25km away (Should NOT show up in default feed)
    }
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    console.log(process.env.MONGO_URI);
console.log(process.cwd());
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    console.log("Clearing old reels...");
    await Reel.deleteMany({}); // Wipes the collection clean

    console.log("Planting new hyper-local food...");
    await Reel.insertMany(MOCK_REELS);

    console.log("Database seeded! Ready for users.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();