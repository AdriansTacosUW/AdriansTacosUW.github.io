const express = require('express');
const Order = require('../models/Order'); // Import the Order model
const router = express.Router();

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by newest
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Mark an order as completed
router.patch('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;

    const order = await Order.findByIdAndUpdate(id, { isCompleted }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
});

// Delete all orders (Clear Orders Button)
router.delete('/orders', async (req, res) => {
  try {
    await Order.deleteMany({}); // Deletes all orders
    res.status(200).json({ message: 'All orders cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing orders', error });
  }
});

module.exports = router;
