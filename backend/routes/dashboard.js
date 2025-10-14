const express = require('express');
const auth = require('../middleware/auth');
const {
  getDashboardStats,
  getActivityTimeline,
  getEarningsChart
} = require('../controllers/dashboardController');

const router = express.Router();

// All dashboard routes require authentication
router.use(auth);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/activity', getActivityTimeline);
router.get('/earnings', getEarningsChart);

module.exports = router;