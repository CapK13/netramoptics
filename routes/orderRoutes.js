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

      console.log("🔔 Incoming order payload:", {
        items,
        prescriptionType,
        totalPrice,
        userData,
        paymentMethod,
        userId: req.userId,
      });

      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      const parsedUserData = typeof userData === 'string' ? JSON.parse(userData) : userData;
      const prescriptionFile = req.file ? req.file.path : '';

      const order = new Order({
        user: req.userId,
        items: parsedItems,
        prescriptionType,
        prescriptionFile,
        totalAmount: Number(totalPrice),
        userData: parsedUserData,
        paymentMethod,
      });

      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      console.error("❌ Order placement error:", err);
      res.status(500).json({ message: 'Order placement failed', error: err.message });
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
