const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const Order = require('../models/Order');
const User = require('../models/User');
    
router.get('/', verifyToken, async (req, res) => {
  try {     
    const user = await User.findById(req.userId).select('-password');
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({ user, orders });
  } catch (err) {
    console.error("❌ Profile fetch failed:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
