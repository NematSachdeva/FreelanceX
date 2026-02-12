const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['client', 'freelancer']).withMessage('Role must be client or freelancer')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', auth, (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  // This endpoint is optional for logging/analytics
  res.json({ message: 'Logged out successfully', success: true });
});

module.exports = router;