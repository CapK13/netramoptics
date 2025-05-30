// const mongoose = require('mongoose');

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [ // was cartItems
    {     
      name: String,
      image: String,
      price: Number,
      prostyle: String,
      category: String,
      lensType: String,
      prescription: mongoose.Schema.Types.Mixed,
    },        
  ],                      
  prescriptionType: {
    type: String,
    required: true,
  },                                
  prescriptionFile: {   
    type: String,
    default: '',
  },                      
  totalAmount: Number,
  userData: { 
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },  
  paymentMethod: {
      type: String,
    enum: ['cod', 'online'],
    required: true,
  },  
  status: {
    type: String,
    default: 'Pending',
  },    
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Order', orderSchema);
module.exports = mongoose.model('Order', orderSchema);