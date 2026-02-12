const https = require('https');

console.log('🔍 Checking your current IP address...');
console.log('=====================================');

// Function to get public IP
function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.ip);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function checkIP() {
  try {
    const ip = await getPublicIP();
    console.log(`🌐 Your current public IP: ${ip}`);
    console.log('');
    console.log('📋 MongoDB Atlas IP Whitelist Instructions:');
    console.log('==========================================');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Select your project (FreelanceX)');
    console.log('3. Click on "Network Access" in the left sidebar');
    console.log('4. Click "ADD IP ADDRESS"');
    console.log(`5. Add this IP: ${ip}`);
    console.log('6. Or add 0.0.0.0/0 to allow all IPs (not recommended for production)');
    console.log('7. Click "Confirm"');
    console.log('');
    console.log('⏱️  Note: It may take 1-2 minutes for the changes to take effect.');
    console.log('');
    console.log('🔄 After whitelisting, try running: npm run dev');
    
  } catch (error) {
    console.error('❌ Failed to get IP address:', error.message);
    console.log('');
    console.log('💡 You can manually check your IP at: https://whatismyipaddress.com/');
    console.log('Then follow the MongoDB Atlas whitelist instructions above.');
  }
}

checkIP();