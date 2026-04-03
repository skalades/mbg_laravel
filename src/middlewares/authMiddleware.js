const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Extract token from Cookie or Authorization Header
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');
    req.user = verified;
    next();
  } catch (error) {
    // If accessToken is expired, client should call /refresh
    res.status(401).json({ message: 'Invalid or Expired Token', code: 'TOKEN_EXPIRED' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted to ${roles.join(' or ')} only.` 
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRole };
