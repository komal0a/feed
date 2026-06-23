require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Route Imports
const authRoutes = require('./routes/Auth');
const reelRoutes = require('./routes/reels');
const feedRoutes = require('./routes/feed');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- MOUNT YOUR ROUTES HERE ---
app.use('/auth', authRoutes);
app.use('/reels', reelRoutes);
app.use('/api/feed', feedRoutes); // <-- Placed right here!

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the Matrix (MongoDB)'))
  .catch(err => console.error('Database connection failed', err));

app.listen(3000, () => console.log('API running on port 3000'));