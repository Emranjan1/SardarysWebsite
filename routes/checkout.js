const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order } = require('../models');
const { verifyToken } = require('../middleware/authenticationMiddleware');

router.post('/', verifyToken, async (req, res) => {
  const { items, totalAmount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-confirmation`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    // Create an order in your database, which will be updated later with payment status
    const order = await Order.create({
      customerId: req.user.id,
      products: items,
      totalAmount: totalAmount,
      status: 'Pending', // Default to 'Pending' until payment is confirmed
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
