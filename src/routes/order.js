const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [ // previously cartItems
      {
        name: String,
        image: String,
        price: Number,
        prostyle: String,
        category: String,
        lensType: String,
        prescription: mongoose.Schema.Types.Mixed,
      }
    ],
    prescriptionType: {
      type: String,
      enum: ["none", "upload", "manual"],
      required: true,
    },
    prescriptionFile: {
      type: String,
      default: null, // for uploaded file path
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    userData: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
