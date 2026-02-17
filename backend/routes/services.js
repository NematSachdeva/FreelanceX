const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getAllServices,
  getServicesByCategory,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices
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
  body('deliveryTime').trim().notEmpty().withMessage('Delivery time is required'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('requirements').optional().trim()
];

// Public routes
router.get('/', getAllServices);
router.get('/category/:category', getServicesByCategory);

// Protected routes (require authentication) - Must be before /:id
router.get('/user/my-services', auth, getMyServices);
router.post('/', auth, serviceValidation, createService);
router.put('/:id', auth, serviceValidation, updateService);
router.delete('/:id', auth, deleteService);

// Dynamic ID route must be last
router.get('/:id', getServiceById);

module.exports = router;