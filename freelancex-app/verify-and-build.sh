#!/bin/bash

echo "🔍 FreelanceX Backend Deployment Verification"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app/build.gradle.kts" ]; then
    echo "❌ Error: Must run from freelancex-app directory"
    exit 1
fi

echo "1️⃣ Checking BASE_URL configuration..."
if grep -q "https://freelancex-backend.vercel.app/api/" app/build.gradle.kts; then
    echo "   ✅ Production URL configured correctly"
else
    echo "   ❌ Production URL not found in build.gradle.kts"
    exit 1
fi

echo ""
echo "2️⃣ Checking BackendHealthChecker exists..."
if [ -f "app/src/main/java/com/freelancex/utils/BackendHealthChecker.kt" ]; then
    echo "   ✅ BackendHealthChecker.kt found"
else
    echo "   ❌ BackendHealthChecker.kt not found"
    exit 1
fi

echo ""
echo "3️⃣ Checking MainActivity integration..."
if grep -q "backendHealthChecker" app/src/main/java/com/freelancex/presentation/MainActivity.kt; then
    echo "   ✅ MainActivity integrated with health checker"
else
    echo "   ❌ MainActivity not integrated"
    exit 1
fi

echo ""
echo "4️⃣ Cleaning previous builds..."
./gradlew clean > /dev/null 2>&1
echo "   ✅ Clean complete"

echo ""
echo "5️⃣ Building debug APK..."
echo "   (This may take a few minutes...)"
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📱 To install and test:"
    echo "   ./gradlew installDebug"
    echo ""
    echo "📊 To view logs:"
    echo "   adb logcat | grep -E '(BackendHealth|OrderDebug|OrderRepository)'"
    echo ""
    echo "🎉 App is ready to test with production backend!"
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
