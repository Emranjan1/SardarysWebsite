const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');

// Login route
// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password });

  if (!email || !password) {
    console.log('Email or password not provided');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    console.log('User found in database:', user);

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      'sardaryisanidiot!11',
      { expiresIn: '1h' }
    );

    console.log('Generated JWT token:', token);

    // Send token and isAdmin status in the response
    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: error.message });
  }
});


// Register route for customers
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country, password } = req.body;

  console.log('Received registration request:', req.body); // Log entire request body

  if (!firstName || !lastName || !email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'First name, last name, email, and password are required.' });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    console.log('Password does not meet complexity requirements');
    return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.' });
  }

  try {
    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      phone,
      addressLine1,
      addressLine2,
      postalCode,
      city: city || 'London', // Default to 'London' if not provided
      country: country || 'United Kingdom', // Default to 'United Kingdom' if not provided
      password: hashedPassword,
      isAdmin: false
    });

    console.log('User registered successfully:', user.toJSON()); // Logging the actual data

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      'sardaryisanidiot!11',
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});


// Admin route to list all users
router.get('/users', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Admin route to delete a user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.User.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Admin route to delete all users (for development use only)
router.delete('/users', async (req, res) => {
  try {
    await db.User.destroy({ where: {}, truncate: true });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting users:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
