const jwt = require('jsonwebtoken');

// Validate ENV once (on load, not per request)
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('❌ JWT_SECRET environment variable is not set');
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Handle missing header safely
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or malformed',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);

    // Attach user safely
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: err.message, // optional (remove in production if needed)
    });
  }
};

module.exports = authMiddleware;