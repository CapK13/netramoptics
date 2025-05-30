const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
var conn = null;
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Use only this
const mongodb = require('mongodb').MongoClient;
// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded prescription files
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', require('./routes/profileRoutes'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/fetchData", (req, res) => {
  mongodb.connect(process.env.MONGO_URI).then(async (db) => {
    conn = await db.db("netramoptics");

    const frames = await conn.collection('frames').find({}).toArray();
    const goggles = await conn.collection('goggles').find({}).toArray();
    const readingGlasses = await conn.collection('reading_glasses').find({}).toArray();
    const response = {
      frames,
      goggles,
      reading_glasses: readingGlasses
    };

    res.status(200).json(response);

  }).catch((err) => {
    console.log("connection error");
  });

})
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
