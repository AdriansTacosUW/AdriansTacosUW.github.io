const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');  // Include the Order model
const router = express.Router();

// PayPal client setup (ensure you're in Sandbox mode)
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Endpoint to create payment
router.post('/create-payment', async (req, res) => {
  const { totalAmount, tacoQuantity, userEmail } = req.body;

  const order = new Order({
    tacoQuantity,
    totalAmount,
    userEmail,
    status: 'pending', // Payment hasn't been processed yet
  });

  try {
    await order.save();  // Save the order in the database
    console.log('Order saved:', order);

    // Create PayPal payment
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalAmount,
        },
      }],
    });

    const orderResponse = await client.execute(request);
    const approvalUrl = orderResponse.result.links.find(link => link.rel === 'approve').href;

    res.json({ approvalUrl, orderId: order._id });  // Return the PayPal approval URL and the order ID
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating payment', error: err });
  }
});

// Endpoint to capture payment
router.post('/capture-payment', async (req, res) => {
  const { orderId } = req.body;

  // Find the order in the database
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  try {
    // Capture the PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(order.paypalOrderId);
    request.requestBody({});
    const captureResponse = await client.execute(request);

    // Update the order status in the database
    order.status = 'paid';
    await order.save();

    console.log('Payment captured successfully:', captureResponse);
    res.json({ message: 'Payment successful', order });
  } catch (err) {
    console.error('Error capturing payment:', err);
    res.status(500).json({ message: 'Error capturing payment', error: err });
  }
});

module.exports = router;
