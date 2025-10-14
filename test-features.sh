#!/bin/bash

echo "🧪 FreelanceX Feature Testing Script"
echo "===================================="

API_BASE="http://localhost:5001/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=$4
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$API_BASE$endpoint")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $response)"
        ((FAILED++))
    fi
}

# Check if backend is running
echo "Checking if backend is running..."
if ! curl -s "$API_BASE/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo "Please start the backend with: cd backend && npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Backend is running${NC}"
echo ""

# Test Health Check
echo "1. Testing Health Check"
test_endpoint "GET" "/health" "Health check endpoint" 200
echo ""

# Test Public Endpoints
echo "2. Testing Public Endpoints"
test_endpoint "GET" "/services" "Get all services" 200
test_endpoint "GET" "/users" "Get all freelancers" 200
echo ""

# Test Authentication Endpoints
echo "3. Testing Authentication Endpoints"
test_endpoint "POST" "/auth/register" "Register endpoint (without data)" 400
test_endpoint "POST" "/auth/login" "Login endpoint (without data)" 400
echo ""

# Test Protected Endpoints (should fail without auth)
echo "4. Testing Protected Endpoints (should require auth)"
test_endpoint "GET" "/users/profile/me" "Get current user (no auth)" 401
test_endpoint "PUT" "/users/profile" "Update profile (no auth)" 401
test_endpoint "GET" "/dashboard/stats" "Get dashboard stats (no auth)" 401
test_endpoint "POST" "/services" "Create service (no auth)" 401
test_endpoint "POST" "/orders" "Create order (no auth)" 401
echo ""

# Test with sample user login
echo "5. Testing with Sample User Authentication"
echo "Attempting to login with sample user..."

LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token: ${TOKEN:0:20}..."
    ((PASSED++))
    
    # Test authenticated endpoints
    echo ""
    echo "6. Testing Authenticated Endpoints"
    
    # Test profile endpoints
    echo -n "Testing: Get current user profile... "
    PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE/users/profile/me" \
      -H "Authorization: Bearer $TOKEN")
    PROFILE_STATUS=$(echo "$PROFILE_RESPONSE" | tail -n1)
    
    if [ "$PROFILE_STATUS" -eq "200" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Status: $PROFILE_STATUS)"
        ((FAILED++))
    fi
    
    # Test dashboard endpoints
    echo -n "Testing: Get dashboard stats... "
    DASHBOARD_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE/dashboard/stats" \
      -H "Authorization: Bearer $TOKEN")
    DASHBOARD_STATUS=$(echo "$DASHBOARD_RESPONSE" | tail -n1)
    
    if [ "$DASHBOARD_STATUS" -eq "200" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Status: $DASHBOARD_STATUS)"
        ((FAILED++))
    fi
    
    # Test activity endpoint
    echo -n "Testing: Get activity timeline... "
    ACTIVITY_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE/dashboard/activity" \
      -H "Authorization: Bearer $TOKEN")
    ACTIVITY_STATUS=$(echo "$ACTIVITY_RESPONSE" | tail -n1)
    
    if [ "$ACTIVITY_STATUS" -eq "200" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Status: $ACTIVITY_STATUS)"
        ((FAILED++))
    fi
    
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "Make sure sample data is loaded: cd backend && npm run init-db"
    ((FAILED++))
fi

echo ""
echo "=================================="
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo "=================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the output above.${NC}"
    exit 1
fi