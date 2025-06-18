const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Token missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the entire decoded token (which includes user ID) to the request
    req.user = decoded;

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({
      message:
        err.name === 'TokenExpiredError'
          ? 'Session expired. Please login again.'
          : 'Invalid token. Access denied.',
    });
  }
};

module.exports = { verifyToken };
