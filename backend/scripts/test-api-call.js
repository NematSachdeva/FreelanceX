const fetch = require('node-fetch');

const testAPICall = async () => {
  try {
    // Test the order API endpoint
    const orderId = '698c87b5d85c790459189a9c'; // From our previous test
    const url = `http://localhost:5001/api/orders/${orderId}`;
    
    console.log('🔍 Testing API call to:', url);
    
    // We need a valid JWT token for this test
    // For now, let's just test if the endpoint responds
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('📡 Response status:', response.status);
    console.log('📦 Response data:', data);
    
  } catch (error) {
    console.error('❌ API test error:', error);
  }
};

testAPICall();