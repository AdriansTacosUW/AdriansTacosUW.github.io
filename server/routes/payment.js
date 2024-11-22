const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

// Set up PayPal environment
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Create PayPal payment
router.post('/create-payment', async (req, res) => {
  const orderDetails = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: orderDetails.totalAmount,
      },
    }],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ approvalUrl: order.links[1].href });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Capture PayPal payment (after user makes payment)
router.post('/capture-payment', async (req, res) => {
  const { orderId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    if (capture.status === "COMPLETED") {
      res.status(200).json({ message: "Payment successful", capture });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
