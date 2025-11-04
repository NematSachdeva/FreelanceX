const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('\n=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Request URL:', req.method, req.originalUrl);
    
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader ? `${authHeader.substring(0, 30)}...` : 'MISSING');
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('🔑 Token Received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    if (!token) {
      console.log('❌ No token provided');
      console.log('=== END AUTH MIDDLEWARE ===\n');
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Verify token with same secret used in login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('👤 Decoded User:', decoded);
    console.log('User ID from token:', decoded.userId);
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Database lookup result:', user ? 'USER FOUND' : 'USER NOT FOUND');
    
    if (user) {
      console.log('User details:', {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    }
    
    if (!user) {
      console.log('❌ User not found in database');
      console.log('=== END AUTH MIDDLEWARE ===\n');
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    console.log('✅ Auth successful, user attached to request');
    console.log('req.user is now:', req.user ? 'DEFINED' : 'UNDEFINED');
    console.log('=== END AUTH MIDDLEWARE ===\n');
    
    return next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error.message);
    console.log('Error type:', error.name);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('JWT Error: Invalid token format or signature');
    } else if (error.name === 'TokenExpiredError') {
      console.log('JWT Error: Token has expired');
    }
    
    console.log('=== END AUTH MIDDLEWARE ===\n');
    return res.status(401).json({ 
      message: 'Token is not valid', 
      error: error.message 
    });
  }
};

module.exports = auth;