const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');

// Get dashboard statistics for current user
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role || req.user.accountType;

    let stats = {
      user: {
        name: req.user.name,
        email: req.user.email,
        role: userRole,
        avatar: req.user.avatar
      }
    };

    if (userRole === 'freelancer') {
      // Freelancer dashboard stats
      const [services, orders, completedOrders] = await Promise.all([
        Service.countDocuments({ createdBy: userId, isActive: true }),
        Order.countDocuments({ seller: userId }),
        Order.countDocuments({ seller: userId, status: 'completed' })
      ]);

      // Calculate total earnings from completed orders
      const earningsData = await Order.aggregate([
        { $match: { seller: userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const totalEarnings = earningsData.length > 0 ? earningsData[0].total : 0;

      // Get recent orders
      const recentOrders = await Order.find({ seller: userId })
        .populate('service', 'title')
        .populate('buyer', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(5);

      // Get active services
      const activeServices = await Service.find({ createdBy: userId, isActive: true })
        .sort({ createdAt: -1 })
        .limit(5);

      stats.freelancer = {
        totalServices: services,
        totalOrders: orders,
        completedOrders: completedOrders,
        activeOrders: orders - completedOrders,
        totalEarnings: totalEarnings,
        averageOrderValue: orders > 0 ? (totalEarnings / completedOrders || 0).toFixed(2) : 0,
        recentOrders: recentOrders,
        activeServices: activeServices
      };

    } else {
      // Client dashboard stats
      const [totalOrders, activeOrders, completedOrders] = await Promise.all([
        Order.countDocuments({ buyer: userId }),
        Order.countDocuments({ buyer: userId, status: { $in: ['pending', 'accepted', 'in-progress'] } }),
        Order.countDocuments({ buyer: userId, status: 'completed' })
      ]);

      // Calculate total spent
      const spendingData = await Order.aggregate([
        { $match: { buyer: userId } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const totalSpent = spendingData.length > 0 ? spendingData[0].total : 0;

      // Get recent orders
      const recentOrders = await Order.find({ buyer: userId })
        .populate('service', 'title image')
        .populate('seller', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(5);

      stats.client = {
        totalOrders: totalOrders,
        activeOrders: activeOrders,
        completedOrders: completedOrders,
        cancelledOrders: await Order.countDocuments({ buyer: userId, status: 'cancelled' }),
        totalSpent: totalSpent,
        averageOrderValue: totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : 0,
        recentOrders: recentOrders
      };
    }

    // Get overall platform stats (optional)
    stats.platform = {
      totalUsers: await User.countDocuments(),
      totalServices: await Service.countDocuments({ isActive: true }),
      totalOrders: await Order.countDocuments()
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// Get activity timeline
const getActivityTimeline = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    // Get recent orders
    const orders = await Order.find({
      $or: [{ buyer: userId }, { seller: userId }]
    })
      .populate('service', 'title')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Format activity timeline
    const timeline = orders.map(order => ({
      id: order._id,
      type: 'order',
      action: order.buyer._id.toString() === userId.toString() ? 'placed' : 'received',
      title: order.service.title,
      status: order.status,
      amount: order.totalAmount,
      date: order.createdAt,
      user: order.buyer._id.toString() === userId.toString() ? order.seller : order.buyer
    }));

    res.json({ timeline });
  } catch (error) {
    console.error('Activity timeline error:', error);
    res.status(500).json({ message: 'Server error fetching activity timeline' });
  }
};

// Get earnings chart data (for freelancers)
const getEarningsChart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'month' } = req.query; // month, week, year

    let dateFilter;
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'year':
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default: // month
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
    }

    const earnings = await Order.aggregate([
      {
        $match: {
          seller: userId,
          status: 'completed',
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({ earnings, period });
  } catch (error) {
    console.error('Earnings chart error:', error);
    res.status(500).json({ message: 'Server error fetching earnings data' });
  }
};

module.exports = {
  getDashboardStats,
  getActivityTimeline,
  getEarningsChart
};