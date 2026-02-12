const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  addOrderMessage,
  addOrderRating,
  getClientOrders,
  getFreelancerOrders,
  completeOrder,
  addReview
} = require('../controllers/orderController');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('serviceId').isMongoId().withMessage('Valid service ID is required'),
  body('requirements').trim().isLength({ min: 5 }).withMessage('Requirements must be at least 5 characters'),
  body('deliveryDate').optional().isISO8601().withMessage('Valid delivery date is required'),
  body('paymentMethod').optional().isIn(['credit-card', 'paypal', 'bank-transfer', 'crypto']).withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'disputed']).withMessage('Invalid status')
];

const messageValidation = [
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
];

const ratingValidation = [
  body('score').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review must be less than 500 characters')
];

// All routes require authentication
router.use(auth);

// Order routes
router.post('/', createOrderValidation, createOrder);
router.get('/', getUserOrders);
router.get('/freelancer', getFreelancerOrders); // Get orders for current freelancer
router.get('/client/:id', getClientOrders);
router.get('/freelancer/:id', getFreelancerOrders); // Get orders for specific freelancer
router.get('/:id', getOrderById);
router.put('/:id/status', updateStatusValidation, updateOrderStatus);
router.put('/:id/complete', completeOrder);
router.post('/:id/messages', messageValidation, addOrderMessage);
router.post('/:id/rating', ratingValidation, addOrderRating);
router.post('/:id/review', ratingValidation, addReview);

module.exports = router;