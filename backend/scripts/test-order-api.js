const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');

const testOrderAPI = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the current user
    const currentUser = await User.findOne({ email: 'nematsachdeva0009@gmail.com' });
    console.log(`👤 Current user: ${currentUser.name} (${currentUser._id})`);

    // Get one of the user's orders
    const order = await Order.findOne({ buyer: currentUser._id })
      .populate('service', 'title description price category')
      .populate('buyer', 'name email profile')
      .populate('seller', 'name email profile');

    if (!order) {
      console.log('❌ No orders found for user');
      return;
    }

    console.log(`📦 Found order: ${order._id}`);
    console.log(`🛍️ Service: ${order.service?.title}`);
    console.log(`👥 Buyer: ${order.buyer?.name} (${order.buyer?._id})`);
    console.log(`👨‍💼 Seller: ${order.seller?.name} (${order.seller?._id})`);

    // Check authorization logic
    const isInvolved = order.buyer._id.toString() === currentUser._id.toString() ||
                      order.seller._id.toString() === currentUser._id.toString();
    
    console.log(`🔐 User is involved in order: ${isInvolved}`);
    console.log(`🆔 Order ID for API call: ${order._id.toString()}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testOrderAPI();