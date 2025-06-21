const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const mongodb = require('mongodb').MongoClient;

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
let conn = null;

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://www.netramoptic.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

app.get('/fetchData', async (req, res) => {
  try {
    const dbClient = await mongodb.connect(process.env.MONGO_URI);
    conn = dbClient.db("netramoptics");

    const frames = await conn.collection('frames').find({}).toArray();
    const goggles = await conn.collection('goggles').find({}).toArray();
    const readingGlasses = await conn.collection('reading_glasses').find({}).toArray();

    res.status(200).json({ frames, goggles, reading_glasses: readingGlasses });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection error" });
  }
});

// ✅ Serve React frontend static files
app.use(express.static(path.join(__dirname, 'client/build')));

// ✅ Catch-all route for React Router (deep linking support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
