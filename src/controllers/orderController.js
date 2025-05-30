const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  try {
    const { cartItems, totalPrice, shippingFee } = req.body;
    const prescriptionFile = req.file ? req.file.path : null;
    const userId = req.userId; // from auth middleware

    // Attach uploaded file path to relevant item(s)
    if (prescriptionFile && cartItems.length > 0) {
      cartItems[0].prescriptionFile = prescriptionFile; // optionally handle per item
    }

    const order = new Order({
      userId,
      cartItems,
      totalPrice,
      shippingFee,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order placement failed.' });
  }
};
