const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { becomeSeller } = require('../controllers/sellerController');

const router = express.Router();

// Validation rules
const sellerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('bio').trim().isLength({ min: 10 }).withMessage('Bio must be at least 10 characters')
];

// Protected routes (require authentication)
router.post('/', auth, sellerValidation, becomeSeller);

module.exports = router;