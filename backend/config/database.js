const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set mongoose options for better connection handling
    mongoose.set('strictQuery', false);
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log('============================================================');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
    return conn;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // More specific error messages and solutions
    if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 DNS Resolution Error: Cannot resolve MongoDB host');
      console.error('💡 Solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Try using a different DNS server (8.8.8.8, 1.1.1.1)');
      console.error('   3. Check if your network blocks MongoDB ports');
    } else if (error.message.includes('IP') && error.message.includes('whitelist')) {
      console.error('🔒 IP Whitelist Error: Your IP is not allowed');
      console.error('💡 Solutions:');
      console.error('   1. Add your current IP to MongoDB Atlas whitelist');
      console.error('   2. Add 0.0.0.0/0 to allow all IPs (not recommended for production)');
      console.error('   3. Check your current IP: https://whatismyipaddress.com/');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication Error: Invalid credentials');
      console.error('💡 Solutions:');
      console.error('   1. Check your MongoDB username and password');
      console.error('   2. Ensure the user has proper database permissions');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️  Connection Timeout: MongoDB server not responding');
      console.error('💡 Solutions:');
      console.error('   1. Check if MongoDB Atlas cluster is running');
      console.error('   2. Try again in a few minutes');
    }
    
    console.log('\n🔄 Server will continue running without database...');
    console.log('⚠️  Some features may not work properly until database is connected.');
    console.log('============================================================');
    
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    return null;
  }
};

module.exports = connectDB;