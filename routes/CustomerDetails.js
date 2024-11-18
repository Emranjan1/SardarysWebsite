// routes/CustomerDetails.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authenticationMiddleware');
const { CustomerDetails } = require('../models');

// Get customer details
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const CustomerDetails = await CustomerDetails.findOne({ where: { userId } });
    if (!CustomerDetails) {
      return res.status(404).json({ error: 'Customer details not found' });
    }
    res.json(CustomerDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update customer details
router.post('/', verifyToken, async (req, res) => {
  const { firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country } = req.body;
  const userId = req.user.id;

  try {
    let CustomerDetails = await CustomerDetails.findOne({ where: { userId } });

    if (CustomerDetails) {
      CustomerDetails = await CustomerDetails.update({ firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country });
      res.status(200).json(CustomerDetails);
    } else {
      CustomerDetails = await CustomerDetails.create({ firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country, userId });
      res.status(201).json(CustomerDetails);
    }
  } catch (error) {
    console.error('Error handling customer details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
