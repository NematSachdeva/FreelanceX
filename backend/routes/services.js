const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getAllServices,
  getServicesByCategory,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const router = express.Router();

// Validation rules
const serviceValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').isIn([
    'web-development',
    'mobile-development',
    'ui-ux-design',
    'graphic-design',
    'digital-marketing',
    'seo',
    'content-writing',
    'video-editing',
    'data-analysis',
    'consulting'
  ]).withMessage('Please select a valid category'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('deliveryTime').isInt({ min: 1 }).withMessage('Delivery time must be at least 1 day'),
  body('contactInfo').trim().notEmpty().withMessage('Contact information is required')
];

// Public routes
router.get('/', getAllServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);

// Protected routes (require authentication)
router.post('/', auth, serviceValidation, createService);
router.put('/:id', auth, serviceValidation, updateService);
router.delete('/:id', auth, deleteService);

module.exports = router;