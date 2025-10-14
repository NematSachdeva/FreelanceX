const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllFreelancers,
  getFreelancerById,
  updateProfile,
  getCurrentUser,
  getUserProfile
} = require('../controllers/userController');

const router = express.Router();

// Protected routes (must come first to avoid conflicts)
router.get('/profile/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);

// Public routes
router.get('/', getAllFreelancers);
router.get('/profile/:id', getUserProfile);
router.get('/:id', getFreelancerById);

module.exports = router;