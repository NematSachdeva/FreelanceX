const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');

// Create new order
const createOrder = async (req, res) => {
  try {
    console.log('\n=== CREATE ORDER DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Authenticated user:', req.user ? {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    } : 'NO USER ATTACHED');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Support both mobile app format (serviceId, clientId, freelancerId) and web format
    const { serviceId, clientId, freelancerId, requirements, deliveryDate, paymentMethod } = req.body;

    // Use authenticated user as buyer (ignore clientId from request for security)
    if (!req.user || !req.user._id) {
      console.log('❌ No authenticated user found in request');
      return res.status(401).json({ message: 'Invalid user session' });
    }
    
    const buyerId = req.user._id;
    console.log('✅ Using buyer ID from authenticated user:', buyerId);

    // Check if service exists
    const service = await Service.findById(serviceId).populate('createdBy');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Determine seller ID (use freelancerId from request or service.createdBy)
    const sellerId = freelancerId || service.createdBy._id;

    // Check if buyer is not the same as seller
    if (sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({ message: 'You cannot order your own service' });
    }

    // Calculate delivery date if not provided
    let calculatedDeliveryDate = deliveryDate;
    if (!calculatedDeliveryDate) {
      // Parse delivery time from service (e.g., "5 days", "1 week", "2 weeks")
      const deliveryTimeStr = service.deliveryTime || '7 days';
      let days = 7; // default
      
      if (deliveryTimeStr.includes('day')) {
        const match = deliveryTimeStr.match(/(\d+)\s*day/);
        days = match ? parseInt(match[1]) : 7;
      } else if (deliveryTimeStr.includes('week')) {
        const match = deliveryTimeStr.match(/(\d+)\s*week/);
        days = match ? parseInt(match[1]) * 7 : 7;
      } else if (deliveryTimeStr.includes('month')) {
        const match = deliveryTimeStr.match(/(\d+)\s*month/);
        days = match ? parseInt(match[1]) * 30 : 30;
      }
      
      calculatedDeliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const orderData = {
      service: serviceId,
      buyer: buyerId,
      seller: sellerId,
      totalAmount: service.price,
      requirements,
      deliveryDate: calculatedDeliveryDate,
      paymentMethod: paymentMethod || 'credit-card'
    };

    const order = new Order(orderData);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('service', 'title description price')
      .populate('buyer', 'name email')
      .populate('seller', 'name email');

    console.log('✅ Order created successfully:', populatedOrder._id);
    console.log('=== END CREATE ORDER ===\n');
    
    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('Error stack:', error.stack);
    console.log('=== END CREATE ORDER ===\n');
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
};

// Get all orders for current user
const getUserOrders = async (req, res) => {
  try {
    const { status, type = 'all', page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by user type (buyer, seller, or all)
    if (type === 'buyer') {
      query.buyer = req.user._id;
    } else if (type === 'seller') {
      query.seller = req.user._id;
    } else {
      query.$or = [
        { buyer: req.user._id },
        { seller: req.user._id }
      ];
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('service', 'title description price category')
      .populate('buyer', 'name email profile.avatar')
      .populate('seller', 'name email profile.avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Transform orders to include id field for frontend compatibility
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.id = orderObj._id.toString();
      return orderObj;
    });

    res.json({
      orders: transformedOrders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    console.log('🔍 Getting order by ID:', req.params.id);
    console.log('👤 User requesting:', req.user._id.toString());
    
    const order = await Order.findById(req.params.id)
      .populate('service', 'title description price category')
      .populate('buyer', 'name email profile')
      .populate('seller', 'name email profile')
      .populate('messages.sender', 'name email');

    if (!order) {
      console.log('❌ Order not found in database');
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('✅ Order found:', order._id.toString());
    console.log('👥 Order participants - Buyer:', order.buyer?._id?.toString(), 'Seller:', order.seller?._id?.toString());

    // Check if user is involved in this order
    const isInvolved = order.buyer._id.toString() === req.user._id.toString() ||
                      order.seller._id.toString() === req.user._id.toString();

    if (!isInvolved) {
      console.log('❌ User not authorized to view this order');
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // Transform order to include id field for frontend compatibility
    const orderObj = order.toObject();
    orderObj.id = orderObj._id.toString();

    console.log('✅ Returning order to frontend');
    res.json(orderObj);
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'disputed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the seller (only seller can update status)
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only seller can update order status' });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('service', 'title description price')
      .populate('buyer', 'name email')
      .populate('seller', 'name email');

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

// Add message to order
const addOrderMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is involved in this order
    const isInvolved = order.buyer.toString() === req.user._id.toString() ||
                      order.seller.toString() === req.user._id.toString();

    if (!isInvolved) {
      return res.status(403).json({ message: 'Not authorized to message in this order' });
    }

    order.messages.push({
      sender: req.user._id,
      message: message.trim()
    });

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('messages.sender', 'name email profile.avatar');

    res.json({
      message: 'Message added successfully',
      messages: updatedOrder.messages
    });
  } catch (error) {
    console.error('Add order message error:', error);
    res.status(500).json({ message: 'Server error adding message' });
  }
};

// Add rating and review
const addOrderRating = async (req, res) => {
  try {
    const { score, review } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'Rating score must be between 1 and 5' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the buyer (only buyer can rate)
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only buyer can rate the order' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed orders' });
    }

    // Check if already rated
    if (order.rating.score) {
      return res.status(400).json({ message: 'Order already rated' });
    }

    order.rating = {
      score,
      review: review || '',
      reviewedAt: new Date()
    };

    await order.save();

    res.json({
      message: 'Rating added successfully',
      rating: order.rating
    });
  } catch (error) {
    console.error('Add order rating error:', error);
    res.status(500).json({ message: 'Server error adding rating' });
  }
};

// Get client's orders
const getClientOrders = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ clientId })
      .populate('serviceId', 'title image price')
      .populate('freelancerId', 'name profilePhoto rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ clientId });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get client orders error:', error);
    res.status(500).json({ message: 'Server error fetching client orders' });
  }
};

// Get freelancer's orders
const getFreelancerOrders = async (req, res) => {
  try {
    // Use provided ID or current user's ID
    const freelancerId = req.params.id || req.user._id;
    const { page = 1, limit = 10 } = req.query;

    // Query using seller field (which is the freelancer)
    const orders = await Order.find({ seller: freelancerId })
      .populate('service', 'title image price')
      .populate('buyer', 'name email profile.avatar')
      .populate('seller', 'name email profile.avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ seller: freelancerId });

    // Transform orders to include id field for frontend compatibility
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.id = orderObj._id.toString();
      return orderObj;
    });

    res.json({
      orders: transformedOrders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get freelancer orders error:', error);
    res.status(500).json({ message: 'Server error fetching freelancer orders' });
  }
};

// Mark order as completed
const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the freelancer
    if (order.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only freelancer can complete the order' });
    }

    order.status = 'completed';
    await order.save();

    // Update freelancer's completed orders count
    await User.findByIdAndUpdate(order.freelancerId, {
      $inc: { completedOrders: 1 }
    });

    const updatedOrder = await Order.findById(order._id)
      .populate('serviceId', 'title image price')
      .populate('clientId', 'name profilePhoto')
      .populate('freelancerId', 'name profilePhoto');

    res.json({
      message: 'Order marked as completed',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ message: 'Server error completing order' });
  }
};

// Add review to order
const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the client
    if (order.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only client can review the order' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed orders' });
    }

    // Check if already reviewed
    if (order.rating) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    order.rating = rating;
    order.review = review || '';
    await order.save();

    // Update freelancer's rating
    const freelancer = await User.findById(order.freelancerId);
    const totalRating = (freelancer.rating * freelancer.profile.totalReviews) + rating;
    freelancer.profile.totalReviews += 1;
    freelancer.rating = totalRating / freelancer.profile.totalReviews;
    freelancer.profile.rating = freelancer.rating;
    await freelancer.save();

    res.json({
      message: 'Review added successfully',
      order
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
};

module.exports = {
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
};