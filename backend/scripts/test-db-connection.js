const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📍 Connection string:', process.env.MONGO_URI?.replace(/\/\/.*@/, '//***:***@'));
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Database connection successful!');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔌 Ready state:', conn.connection.readyState);
    
    await mongoose.disconnect();
    console.log('👋 Disconnected successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify MongoDB Atlas cluster is running');
      console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
      console.log('4. Try using a local MongoDB instance instead');
    }
    
    process.exit(1);
  }
}

testConnection();