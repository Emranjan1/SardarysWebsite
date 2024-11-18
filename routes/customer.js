// routes/customer.js
const router = require('express').Router();
const { verifyToken } = require('../middleware/authenticationMiddleware');
const db = require('../models');

router.get('/details', verifyToken, async (req, res) => {
  try {
    console.log('Request received for user details');
    console.log('User ID:', req.user.id);

    const user = await db.User.findByPk(req.user.id, {
      attributes: ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'addressLine2', 'postalCode', 'city', 'country'],
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

router.put('/update', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country } = req.body;
    console.log('Received update request:', req.body); // Debugging line

    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user with provided details
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.addressLine1 = addressLine1;
    user.addressLine2 = addressLine2;
    user.postalCode = postalCode;
    user.city = city;
    user.country = country;

    await user.save();

    res.json({ message: 'Details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

// Fetch customer details by ID
// Fetch customer details by ID
router.get('/customers/:id/details', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
      const customer = await db.User.findByPk(id, {
          attributes: ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'addressLine2', 'postalCode', 'city', 'country']
      });
      if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
  } catch (error) {
      console.error('Failed to fetch customer details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
