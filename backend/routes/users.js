const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllFreelancers,
  getFreelancerById,
  updateProfile,
  getCurrentUser,
  getUserProfile,
  deleteAccount
} = require('../controllers/userController');

const router = express.Router();

// Protected routes (must come first to avoid conflicts)
router.get('/profile/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.delete('/me', auth, deleteAccount);

// Public routes
router.get('/', getAllFreelancers);
router.get('/profile/:id', getUserProfile);
router.get('/:id', getFreelancerById);

module.exports = router;