// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  isCompleted: {
    type: Boolean,
    default: false, // Orders default to "not done"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
