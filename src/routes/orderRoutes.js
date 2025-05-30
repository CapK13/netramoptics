const express = require('express');
const upload = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/verifyToken');
const Order = require('../models/Order');

const router = express.Router();
  
router.post(
  '/',
  verifyToken,
  upload.single('prescriptionFile'),
  async (req, res) => {
    try {
      const { items, prescriptionType, totalPrice, userData, paymentMethod } = req.body;
      
      // Logging for debugging (optional)
      console.log("🔔 Incoming order payload:", {
        items,
        prescriptionType,
        totalPrice,
        userData,
        paymentMethod,
        userId: req.userId,
      });
      
      const parsedItems = JSON.parse(items);
      const parsedUserData = JSON.parse(userData);
      const prescriptionFile = req.file ? req.file.path : null;
      
      const order = new Order({
        user: req.userId,
        items: parsedItems, // ✅ match the schema field
        prescriptionType,
        prescriptionFile,
        totalAmount: Number(totalPrice), // ✅ ensure numeric value
        userData: parsedUserData,
        paymentMethod,
      });
      
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      console.error("❌ Order placement error:", err);
      res.status(500).json({ message: 'Order placement failed' });
    }
  }
);

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: 'Could not fetch orders' });
  }
});

module.exports = router;