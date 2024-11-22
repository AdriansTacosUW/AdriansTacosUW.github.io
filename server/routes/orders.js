const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Save order after payment
router.post('/save-order', async (req, res) => {
  const { customerName, tacoQuantity, totalAmount, paymentStatus, paymentId } = req.body;

  try {
    const newOrder = new Order({
      customerName,
      tacoQuantity,
      totalAmount,
      paymentStatus,
      paymentId,
      status: 'pending',
    });

    const savedOrder = await newOrder.save();
    res.status(200).json({ message: 'Order saved successfully', orderId: savedOrder._id });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Error saving order' });
  }
});

module.exports = router;
