const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Connected to database: ${dbName}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   Collections:');
      collections.forEach(col => {
        console.log(`   • ${col.name}`);
      });
    }
    
    // Test ping
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Database ping successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Tips:');
      console.log('   • Check your username and password in the connection string');
      console.log('   • Make sure to replace <db_password> with your actual password');
      console.log('   • Verify your MongoDB Atlas user has proper permissions');
    }
    
    if (error.message.includes('network')) {
      console.log('\n💡 Tips:');
      console.log('   • Check your internet connection');
      console.log('   • Verify MongoDB Atlas IP whitelist settings');
      console.log('   • Try adding 0.0.0.0/0 to allow all IPs (for testing)');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
};

testConnection();