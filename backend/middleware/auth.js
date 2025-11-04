const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Headers:', req.headers);
    
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Extracted token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User found:', user ? `${user._id} - ${user.email}` : 'NO USER');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    console.log('✅ Auth successful, user attached to request');
    console.log('=== END AUTH MIDDLEWARE ===\n');
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error.message);
    console.log('Error type:', error.name);
    console.log('=== END AUTH MIDDLEWARE ===\n');
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;