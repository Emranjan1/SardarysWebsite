const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'sardaryisanidiot!11', { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token is required' });
  
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'sardaryisanidiot!11');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = { verifyToken, verifyAdmin };
