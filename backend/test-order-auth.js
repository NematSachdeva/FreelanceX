const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testOrderAuth() {
  console.log('🧪 Testing Order Authentication Flow\n');
  
  try {
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login successful');
    console.log('   User:', user);
    console.log('   Token:', token.substring(0, 30) + '...\n');
    
    // Step 2: Get a service to order
    console.log('2️⃣ Fetching services...');
    const servicesResponse = await axios.get(`${BASE_URL}/services`);
    const service = servicesResponse.data.services[0];
    
    if (!service) {
      console.log('❌ No services found. Please create a service first.');
      return;
    }
    
    console.log('✅ Service found:', service._id);
    console.log('   Title:', service.title);
    console.log('   Price:', service.price);
    console.log('   Created by:', service.createdBy, '\n');
    
    // Step 3: Create order with authentication
    console.log('3️⃣ Creating order with authentication...');
    console.log('   Authorization header:', `Bearer ${token.substring(0, 30)}...`);
    
    const orderResponse = await axios.post(
      `${BASE_URL}/orders`,
      {
        serviceId: service._id,
        requirements: 'Test order requirements from authentication test',
        paymentMethod: 'credit-card'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Order created successfully!');
    console.log('   Order ID:', orderResponse.data.order._id);
    console.log('   Status:', orderResponse.data.order.status);
    console.log('   Buyer:', orderResponse.data.order.buyer);
    console.log('   Seller:', orderResponse.data.order.seller);
    
    console.log('\n🎉 All tests passed! Authentication is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
  }
}

// Run the test
testOrderAuth();
