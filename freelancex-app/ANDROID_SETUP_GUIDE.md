# 📱 FreelanceX Android App - Complete Setup Guide

## 🎯 Overview

This guide will help you set up and run the FreelanceX Android app, which connects to your existing Node.js backend.

---

## 📋 Prerequisites

### Required Software
- **Android Studio**: Hedgehog (2023.1.1) or later
- **JDK**: 17 or later
- **Android SDK**: API 34 (Android 14)
- **Gradle**: 8.2 or later (handled by wrapper)

### Backend Requirements
- FreelanceX backend running on `http://localhost:5001`
- MongoDB with sample data loaded

---

## 🚀 Quick Setup (5 Minutes)

### 1. Open Project in Android Studio
```bash
# Open Android Studio
# File -> Open -> Navigate to: freelancer-marketplace/freelancex-app/
# Select the freelancex-app folder and click OK
```

### 2. Sync Project
```bash
# Android Studio will automatically detect Gradle files
# Click "Sync Now" when prompted
# Wait for dependencies to download (2-3 minutes)
```

### 3. Configure Backend URL
```kotlin
// For Android Emulator (default):
// No changes needed - uses http://10.0.2.2:5001/api/

// For Physical Device:
// Edit: app/src/main/java/com/freelancex/utils/Constants.kt
// Update BASE_URL_DEVICE with your computer's IP address
```

### 4. Run the App
```bash
# Click the green "Run" button in Android Studio
# Or use: Shift + F10
# Select your device/emulator when prompted
```

---

## 🔧 Detailed Configuration

### Backend URL Configuration

#### For Android Emulator
```kotlin
// In Constants.kt - already configured
const val BASE_URL_EMULATOR = "http://10.0.2.2:5001/api/"
```

#### For Physical Device
```bash
# 1. Find your computer's IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# 2. Update Constants.kt
const val BASE_URL_DEVICE = "http://YOUR_IP_ADDRESS:5001/api/"

# Example:
const val BASE_URL_DEVICE = "http://192.168.1.100:5001/api/"
```

#### Build Configuration
```kotlin
// In app/build.gradle.kts
buildTypes {
    debug {
        buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:5001/api/\"")
    }
    release {
        buildConfigField("String", "BASE_URL", "\"https://your-production-api.com/api/\"")
    }
}
```

---

## 📱 Testing the App

### Demo Accounts
Use these accounts to test the app:

```
Freelancers:
- alex@freelancex.com / password123
- sarah@freelancex.com / password123

Clients:
- john@client.com / password123
- emily@client.com / password123
```

### Test Flow
1. **Launch App** → Splash screen appears
2. **Login** → Use demo account
3. **Home Screen** → View featured content
4. **Navigation** → Test bottom navigation tabs
5. **Logout** → Test logout functionality

---

## 🏗️ Project Structure

```
freelancex-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/freelancex/
│   │   │   ├── data/              # Data layer
│   │   │   │   ├── api/           # Retrofit interfaces
│   │   │   │   ├── model/         # Data models
│   │   │   │   └── repository/    # Repository implementations
│   │   │   ├── domain/            # Business logic
│   │   │   │   └── repository/    # Repository interfaces
│   │   │   ├── presentation/      # UI layer
│   │   │   │   ├── ui/            # Compose screens
│   │   │   │   ├── viewmodel/     # ViewModels
│   │   │   │   ├── navigation/    # Navigation setup
│   │   │   │   └── theme/         # Material 3 theme
│   │   │   ├── di/                # Dependency injection
│   │   │   └── utils/             # Utilities
│   │   ├── res/                   # Android resources
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

---

## 🎨 Features Implemented

### ✅ Core Features
- **Authentication**: Login/Register with JWT
- **Home Screen**: Featured services and freelancers
- **Navigation**: Bottom navigation with 4 tabs
- **Material 3 Design**: Modern UI with proper theming
- **Secure Storage**: EncryptedSharedPreferences for tokens
- **Network Layer**: Retrofit with OkHttp and Gson
- **Architecture**: MVVM with Clean Architecture
- **Dependency Injection**: Hilt for DI

### 🚧 Placeholder Screens
- **Explore**: Service browsing (placeholder)
- **Orders**: Order management (placeholder)
- **Profile**: User profile (basic logout)

---

## 🔧 Development Commands

### Build Commands
```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Install debug APK
./gradlew installDebug

# Clean build
./gradlew clean
```

### Testing Commands
```bash
# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest

# Generate test report
./gradlew testDebugUnitTest
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Solution: Clean and rebuild
./gradlew clean
./gradlew build

# Or in Android Studio:
# Build -> Clean Project
# Build -> Rebuild Project
```

#### 2. Network Connection Issues
```bash
# Check backend is running:
curl http://localhost:5001/api/health

# For physical device, use your IP:
curl http://YOUR_IP:5001/api/health

# Ensure CORS is configured in backend
```

#### 3. Dependency Issues
```bash
# Invalidate caches and restart:
# File -> Invalidate Caches and Restart -> Invalidate and Restart
```

#### 4. Emulator Issues
```bash
# Create new AVD:
# Tools -> AVD Manager -> Create Virtual Device
# Recommended: Pixel 6 with API 34
```

### Network Debugging
```kotlin
// Enable network logging (already configured in debug builds)
// Check Logcat for HTTP requests and responses
// Filter by "OkHttp" to see network calls
```

---

## 📊 API Integration

### Endpoints Used
```kotlin
// Authentication
POST /auth/login
POST /auth/register
GET /auth/me

// Services
GET /services
GET /services/{id}
GET /services/featured

// Users
GET /users
GET /users/{id}
GET /users/top

// Orders (prepared)
GET /orders
POST /orders
PUT /orders/{id}/status
```

### Request Headers
```kotlin
// Automatically added by AuthInterceptor
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🔒 Security Features

### Token Management
```kotlin
// Secure storage using EncryptedSharedPreferences
// AES256_GCM encryption for token storage
// Automatic token attachment to API requests
```

### Network Security
```kotlin
// HTTPS ready for production
// Certificate pinning ready (commented out)
// Request/response logging only in debug builds
```

---

## 🚀 Next Steps

### Phase 1: Complete Core Features
1. **Explore Screen**: Service browsing with filters
2. **Service Details**: Full service information
3. **Orders Screen**: Order management
4. **Profile Screen**: User profile editing

### Phase 2: Advanced Features
1. **Real-time Chat**: Socket.IO integration
2. **Push Notifications**: Firebase Cloud Messaging
3. **Payment Integration**: Stripe/Razorpay SDK
4. **File Upload**: Image/video upload

### Phase 3: Polish
1. **Offline Support**: Room database
2. **Dark Mode**: Theme switching
3. **Animations**: Enhanced UI animations
4. **Performance**: Optimization and caching

---

## 📚 Learning Resources

### Android Development
- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
- [Material 3 Design System](https://m3.material.io/)
- [Android Architecture Guide](https://developer.android.com/topic/architecture)

### Libraries Used
- [Hilt Dependency Injection](https://dagger.dev/hilt/)
- [Retrofit Networking](https://square.github.io/retrofit/)
- [Coil Image Loading](https://coil-kt.github.io/coil/)

---

## 🎯 Success Criteria

### MVP Complete When:
- ✅ App builds and runs successfully
- ✅ User can login with demo accounts
- ✅ Home screen displays data from backend
- ✅ Navigation between tabs works
- ✅ Logout functionality works
- ✅ No crashes during basic usage

### Production Ready When:
- [ ] All screens implemented
- [ ] Error handling comprehensive
- [ ] Offline support added
- [ ] Performance optimized
- [ ] Security validated
- [ ] Testing complete

---

## 📞 Support

### Getting Help
1. **Check Logs**: Use Android Studio Logcat
2. **Network Issues**: Verify backend connectivity
3. **Build Issues**: Clean and rebuild project
4. **Dependencies**: Sync Gradle files

### Common Log Filters
```bash
# In Android Studio Logcat:
FreelanceX          # App-specific logs
OkHttp             # Network requests
System.err         # Error messages
```

---

## 🎉 Congratulations!

You now have a working Android app that connects to your FreelanceX backend!

### What You Have:
- ✅ Modern Android app with Material 3 design
- ✅ Secure authentication with JWT
- ✅ Clean architecture with MVVM
- ✅ Network integration with existing backend
- ✅ Professional UI with Jetpack Compose
- ✅ Ready for feature expansion

### Next Steps:
1. Test the app thoroughly
2. Implement remaining screens
3. Add advanced features
4. Deploy to Play Store

**Happy Android Development!** 📱✨