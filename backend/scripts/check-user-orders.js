const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');

const checkUserOrders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the current user (from the logs we saw earlier)
    const currentUser = await User.findOne({ email: 'nematsachdeva0009@gmail.com' });
    if (!currentUser) {
      console.log('❌ Current user not found');
      return;
    }

    console.log(`👤 Current user: ${currentUser.name} (${currentUser.email}) - Role: ${currentUser.role}`);
    console.log(`🆔 User ID: ${currentUser._id}`);

    // Check orders for this user (as buyer)
    const buyerOrders = await Order.find({ buyer: currentUser._id })
      .populate('service', 'title price')
      .populate('seller', 'name email');
    
    console.log(`📦 Orders as buyer: ${buyerOrders.length}`);
    buyerOrders.forEach(order => {
      console.log(`  - Order ${order._id} - Status: ${order.status} - Service: ${order.service?.title || 'N/A'}`);
      console.log(`    Seller: ${order.seller?.name || 'N/A'}`);
    });

    // Check orders for this user (as seller)
    const sellerOrders = await Order.find({ seller: currentUser._id })
      .populate('service', 'title price')
      .populate('buyer', 'name email');
    
    console.log(`🛍️ Orders as seller: ${sellerOrders.length}`);
    sellerOrders.forEach(order => {
      console.log(`  - Order ${order._id} - Status: ${order.status} - Service: ${order.service?.title || 'N/A'}`);
      console.log(`    Buyer: ${order.buyer?.name || 'N/A'}`);
    });

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUserOrders();