const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

const testRoutes = async () => {
  console.log('🧪 Testing FreelanceX API Routes...\n');

  const tests = [
    { method: 'GET', url: '/', description: 'Root endpoint' },
    { method: 'GET', url: '/api/health', description: 'Health check' },
    { method: 'GET', url: '/api/services', description: 'Get all services' },
    { method: 'GET', url: '/api/users', description: 'Get all users' },
    { method: 'GET', url: '/api/nonexistent', description: '404 test' }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.method} ${test.url} - ${test.description}`);
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        timeout: 5000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Response: ${JSON.stringify(response.data, null, 2)}\n`);
      
    } catch (error) {
      if (error.response) {
        console.log(`⚠️  Status: ${error.response.status}`);
        console.log(`📄 Response: ${JSON.stringify(error.response.data, null, 2)}\n`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`❌ Connection refused - Server not running on ${BASE_URL}`);
        console.log(`💡 Make sure to run 'npm run dev' first\n`);
      } else {
        console.log(`❌ Error: ${error.message}`);
        console.log(`🔍 Error code: ${error.code || 'Unknown'}\n`);
      }
    }
  }
};

// Test authentication endpoints
const testAuth = async () => {
  console.log('🔐 Testing Authentication...\n');
  
  try {
    // Test registration
    console.log('Testing POST /api/auth/register');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'client'
    });
    
    console.log(`✅ Registration Status: ${registerResponse.status}`);
    console.log(`🎫 Token received: ${registerResponse.data.token ? 'Yes' : 'No'}\n`);
    
    // Test login with sample user
    console.log('Testing POST /api/auth/login');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    
    console.log(`✅ Login Status: ${loginResponse.status}`);
    console.log(`🎫 Token received: ${loginResponse.data.token ? 'Yes' : 'No'}\n`);
    
  } catch (error) {
    if (error.response) {
      console.log(`⚠️  Auth Error Status: ${error.response.status}`);
      console.log(`📄 Response: ${JSON.stringify(error.response.data, null, 2)}\n`);
    } else {
      console.log(`❌ Auth Error: ${error.message}\n`);
    }
  }
};

const runAllTests = async () => {
  try {
    await testRoutes();
    await testAuth();
    console.log('🎉 All tests completed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
};

runAllTests();