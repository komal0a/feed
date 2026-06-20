// models/Reel.js
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  restaurant: String,
  dishName: String,
  price: String,
  videoUrl: String,
  // The crucial GeoJSON formatting for MongoDB
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude] - MUST be in this order!
      required: true
    }
  }
});

// This index is what makes the $near query hyper-fast
reelSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Reel', reelSchema);