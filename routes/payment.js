const express = require("express");
const router = express.Router();
const retry = require("async-retry");
// const { client, ApiError } = require('../config/square');  // Corrected path to config directory
const logger = require("../helpers/logger"); // Corrected path to helpers directory
const { validatePaymentPayload } = require("../schemas/schema"); // Corrected path to schemas directory
const { Order, User, OrderItem, Product } = require("../models");

const { Client } = require("square");
const { verifyToken } = require("../middleware/authenticationMiddleware");

const client = new Client({
  environment: "sandbox", // Change to Environment.Production for live payments
  accessToken:
    "EAAAl8obqqrSn0tVghLaYQGXzP9tkl2UUvBaDPXZxQudXvFOvuu-Y6p1d1_JpEkJ",
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};

// POST route to process payment
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  const {
    sourceId,
    totalAmount,
    billingDetails,
    paymentMethod,
    isCashOnDelivery,
    orderItems,
  } = req.body; // Expecting the token and amount from the frontend

  try {
    const idempotencyKey = new Date().getTime().toString(); // Ensure the transaction is unique

    const paymentResponse = await client.paymentsApi.createPayment({
      sourceId: sourceId, // Token from Google Pay, Apple Pay, or Card
      idempotencyKey,
      amountMoney: {
        amount: Math.round(totalAmount * 100), // Amount in cents (e.g., $10.00 -> 1000)
        currency: "GBP",
      },
      billingDetails: billingDetails,
    });

    const payment = paymentResponse.result.payment;

    if (payment.status === "COMPLETED") {
      const { orderId } = payment;

      // order creation
      const order = await Order.create({
        userId,
        totalAmount: totalAmount,
        orderNumber: orderId,
        paymentMethod,
        status: isCashOnDelivery ? "Pending Payment" : "Completed",
        orderStatus: "In Progress", // Default status when an order is created.
      });

      const items = orderItems.map((item) => ({
        ...item,
        orderId: order.id,
      }));
      await OrderItem.bulkCreate(items);

      res.status(200).json(order);
    } else {
      logger.error(`Payment failed with status ${payment.status}`);
    }
  } catch (error) {
    console.error("Payment Processing Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
