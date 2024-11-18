const express = require('express');
const router = express.Router();
const retry = require('async-retry');
const { client, ApiError } = require('../config/square');  // Corrected path to config directory
const logger = require('../helpers/logger');  // Corrected path to helpers directory
const { validatePaymentPayload } = require('../schemas/schema');  // Corrected path to schemas directory

// POST route to process payment
router.post('/process-payment', async (req, res) => {
  const { nonce, amount, billingDetails } = req.body;  // Ensure these details are sent from the frontend

  // First, validate the incoming payment payload
  if (!validatePaymentPayload(req.body)) {
    return res.status(400).json({ error: 'Invalid payment data provided' });
  }

  try {
    await retry(async bail => {
      // Attempt to create a payment
      const response = await client.paymentsApi.createPayment({
        sourceId: nonce,
        amountMoney: {
          amount: Math.round(amount * 100),  // Convert to smallest currency unit
          currency: 'GBP'
        },
        idempotencyKey: new Date().getTime().toString(),  // Ensure a unique idempotency key
        billingDetails: billingDetails
      });

      res.status(200).json(response.result);
    }, {
      retries: 3,  // Set the number of retries
      onRetry: (error, attempt) => {
        logger.error(`Attempt ${attempt} failed with error: ${error.message}`);
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      logger.error('API Error occurred:', error.errors);
      res.status(500).json({ error: error.errors });
    } else {
      logger.error('Failed to process payment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;
