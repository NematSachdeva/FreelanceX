const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');

const checkData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check users
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    if (userCount > 0) {
      const users = await User.find().limit(3);
      console.log('Sample users:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }

    // Check services
    const serviceCount = await Service.countDocuments();
    console.log(`🛍️ Services in database: ${serviceCount}`);
    
    if (serviceCount > 0) {
      const services = await Service.find().limit(3);
      console.log('Sample services:');
      services.forEach(service => {
        console.log(`  - ${service.title} - ₹${service.price}`);
      });
    }

    // Check orders
    const orderCount = await Order.countDocuments();
    console.log(`📦 Orders in database: ${orderCount}`);
    
    if (orderCount > 0) {
      const orders = await Order.find().populate('service', 'title').populate('buyer', 'name').populate('seller', 'name').limit(3);
      console.log('Sample orders:');
      orders.forEach(order => {
        console.log(`  - Order ${order._id} - Status: ${order.status} - Service: ${order.service?.title || 'N/A'}`);
        console.log(`    Buyer: ${order.buyer?.name || 'N/A'} - Seller: ${order.seller?.name || 'N/A'}`);
      });
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkData();