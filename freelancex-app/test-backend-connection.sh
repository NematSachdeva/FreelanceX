#!/bin/bash

echo "🧪 Testing Backend Connection"
echo "=============================="
echo ""

BACKEND_URL="https://freelancex-backend.vercel.app"

echo "1️⃣ Testing root endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BACKEND_URL/"

echo ""
echo "2️⃣ Testing health endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BACKEND_URL/api/health"

echo ""
echo "3️⃣ Testing services endpoint..."
SERVICES_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/api/services?limit=1")
HTTP_STATUS=$(echo "$SERVICES_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Backend is reachable and responding"
else
    echo "❌ Backend returned status: $HTTP_STATUS"
fi

echo ""
echo "4️⃣ Testing from Android app..."
echo "Run: adb logcat | grep -E '(BackendHealth|MainActivity)'"
echo ""
echo "Expected output:"
echo "  ✅ Backend Connected - Status: 200"
echo "  ✅ Backend is reachable and responding"
