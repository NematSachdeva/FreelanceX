#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 FreelanceX Local Database Setup');
console.log('=====================================');

// Check if MongoDB is installed
function checkMongoDB() {
  try {
    execSync('mongod --version', { stdio: 'pipe' });
    console.log('✅ MongoDB is installed');
    return true;
  } catch (error) {
    console.log('❌ MongoDB is not installed');
    return false;
  }
}

// Check if MongoDB is running
function checkMongoDBRunning() {
  try {
    execSync('mongo --eval "db.runCommand({ connectionStatus: 1 })"', { stdio: 'pipe' });
    console.log('✅ MongoDB is running');
    return true;
  } catch (error) {
    console.log('❌ MongoDB is not running');
    return false;
  }
}

// Install MongoDB instructions
function showInstallInstructions() {
  console.log('\n📦 MongoDB Installation Instructions:');
  console.log('=====================================');
  
  const platform = process.platform;
  
  if (platform === 'darwin') {
    console.log('For macOS:');
    console.log('1. Install Homebrew if you haven\'t: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    console.log('2. Install MongoDB: brew tap mongodb/brew && brew install mongodb-community');
    console.log('3. Start MongoDB: brew services start mongodb/brew/mongodb-community');
  } else if (platform === 'win32') {
    console.log('For Windows:');
    console.log('1. Download MongoDB from: https://www.mongodb.com/try/download/community');
    console.log('2. Install and follow the setup wizard');
    console.log('3. Start MongoDB service from Services app');
  } else {
    console.log('For Linux:');
    console.log('1. Follow instructions at: https://docs.mongodb.com/manual/administration/install-on-linux/');
    console.log('2. Start MongoDB: sudo systemctl start mongod');
  }
}

// Start MongoDB
function startMongoDB() {
  const platform = process.platform;
  
  try {
    if (platform === 'darwin') {
      execSync('brew services start mongodb/brew/mongodb-community', { stdio: 'inherit' });
    } else if (platform === 'linux') {
      execSync('sudo systemctl start mongod', { stdio: 'inherit' });
    } else {
      console.log('Please start MongoDB manually on Windows');
      return false;
    }
    console.log('✅ MongoDB started successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to start MongoDB:', error.message);
    return false;
  }
}

// Update .env file
function updateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Comment out Atlas connection and use local
  envContent = envContent.replace(
    /^MONGO_URI="mongodb\+srv:\/\/.*$/m,
    '# MONGO_URI="mongodb+srv://freelancex_user:JaiGauriShankar0001@freelancexcluster.mlz8djx.mongodb.net/freelancex?retryWrites=true&w=majority&appName=FreelanceXCluster"'
  );
  
  // Add local connection if not exists
  if (!envContent.includes('MONGO_URI="mongodb://localhost:27017/freelancex"')) {
    envContent = 'MONGO_URI="mongodb://localhost:27017/freelancex"\n' + envContent;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env file to use local MongoDB');
}

// Main setup function
async function setup() {
  const isInstalled = checkMongoDB();
  
  if (!isInstalled) {
    showInstallInstructions();
    console.log('\n❗ Please install MongoDB first, then run this script again.');
    process.exit(1);
  }
  
  const isRunning = checkMongoDBRunning();
  
  if (!isRunning) {
    console.log('\n🔄 Attempting to start MongoDB...');
    const started = startMongoDB();
    
    if (!started) {
      showInstallInstructions();
      process.exit(1);
    }
    
    // Wait a moment for MongoDB to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  updateEnvFile();
  
  console.log('\n🎉 Setup complete!');
  console.log('📝 Your .env file has been updated to use local MongoDB');
  console.log('🚀 You can now run: npm run dev');
  console.log('\n💡 To switch back to MongoDB Atlas later, uncomment the Atlas connection in .env');
}

// Run setup
setup().catch(console.error);