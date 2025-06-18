const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { MongoClient } = require('mongodb');

dotenv.config();

const app = express();
connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'https://www.netramoptic.com',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// MongoDB fetchData route
app.get('/fetchData', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db('netramoptics');

    const [frames, goggles, readingGlasses] = await Promise.all([
      db.collection('frames').find({}).toArray(),
      db.collection('goggles').find({}).toArray(),
      db.collection('reading_glasses').find({}).toArray(),
    ]);

    res.status(200).json({
      frames,
      goggles,
      reading_glasses: readingGlasses,
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ message: 'Server error while fetching data' });
  } finally {
    if (client) client.close();
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
