const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  tacoQuantity: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model has already been defined
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
