const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found. Unauthorized.' });
      }

      // Check if user has verified email
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email before accessing this route.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({
        message:
          error.name === 'TokenExpiredError'
            ? 'Token expired. Please login again.'
            : 'Not authorized. Token invalid.',
      });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized. Token missing.' });
  }
};

// Admin-only route protection
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only.' });
  }
};

module.exports = { protect, adminOnly };
