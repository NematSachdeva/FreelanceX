#!/bin/bash

echo "🧪 Testing Backend Auth + Schema Sync"
echo "======================================"
echo ""

BACKEND_URL="https://freelancex-backend.vercel.app"

echo "1️⃣ Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/health")
echo "$HEALTH_RESPONSE" | grep -q "FreelanceX API is running"
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi

echo ""
echo "2️⃣ Testing services endpoint (checking schema)..."
SERVICES_RESPONSE=$(curl -s "$BACKEND_URL/api/services?limit=1")

# Check if response contains both createdBy and freelancer
echo "$SERVICES_RESPONSE" | grep -q "createdBy"
HAS_CREATED_BY=$?

echo "$SERVICES_RESPONSE" | grep -q "freelancer"
HAS_FREELANCER=$?

if [ $HAS_CREATED_BY -eq 0 ] && [ $HAS_FREELANCER -eq 0 ]; then
    echo "✅ Schema includes both 'createdBy' and 'freelancer' fields"
    echo "✅ Android compatibility: PASS"
    echo "✅ Website compatibility: PASS"
elif [ $HAS_CREATED_BY -eq 0 ]; then
    echo "⚠️  Schema has 'createdBy' but missing 'freelancer'"
    echo "   Website will work, but Android may have issues"
elif [ $HAS_FREELANCER -eq 0 ]; then
    echo "⚠️  Schema has 'freelancer' but missing 'createdBy'"
    echo "   Android will work, but website may have issues"
else
    echo "❌ Schema missing both fields"
fi

echo ""
echo "3️⃣ Sample service data:"
echo "$SERVICES_RESPONSE" | python3 -m json.tool 2>/dev/null | head -30

echo ""
echo "======================================"
echo "Test complete!"
echo ""
echo "To test authentication:"
echo "1. Login to get token"
echo "2. Use token to create order"
echo "3. Check backend logs for auth middleware output"
