const jwt = require('jsonwebtoken');
const db = require('../models'); // Ensure correct path

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.error('Token is required');
    return res.status(403).json({ error: 'Token is required' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token received:', token); // Debugging line

  if (!token) {
    console.error('Token missing');
    return res.status(403).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging line
    const user = await db.User.findByPk(decoded.id); // Use the Sequelize findByPk method to get user by ID
    if (!user) {
      console.error('Invalid Token');
      return res.status(401).json({ error: 'Invalid Token' });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    console.error('Token verification failed', error);
    return res.status(401).json({ error: 'Invalid Token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.error('Admin access required');
    return res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = { verifyToken, verifyAdmin };
