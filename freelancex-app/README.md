# 📱 FreelanceX Android App

A modern Android app built with Kotlin and Jetpack Compose, connecting to the FreelanceX backend.

## 🎯 Overview

FreelanceX Android app provides a mobile-optimized experience for the freelance marketplace platform, featuring:

- **Modern UI**: Material 3 design with Jetpack Compose
- **Secure Authentication**: JWT token management
- **Real-time Data**: Connected to existing Node.js backend
- **Modular Architecture**: MVVM pattern with clean separation
- **Future-Ready**: Prepared for chat, payments, and video uploads

## 🛠️ Tech Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **Networking**: Retrofit + OkHttp
- **Dependency Injection**: Hilt
- **State Management**: ViewModel + StateFlow
- **Navigation**: Jetpack Navigation Compose
- **Security**: EncryptedSharedPreferences for token storage
- **Backend**: Connects to existing Express.js API

## 📱 Features

### Core Features
- ✅ User Authentication (Login/Register)
- ✅ Browse Services with Filters
- ✅ Service Details with Reviews
- ✅ Order Management
- ✅ User Profiles
- ✅ Search and Categories

### Upcoming Features (Prepared)
- 🔄 Real-time Chat (Socket.IO ready)
- 💳 Payment Integration (Stripe/Razorpay ready)
- 📹 Video Upload for Freelancers
- 🔔 Push Notifications (FCM ready)

## 🏗️ Project Structure

```
freelancex-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/freelancex/
│   │   │   │   ├── data/          # Data layer
│   │   │   │   │   ├── api/       # API interfaces
│   │   │   │   │   ├── model/     # Data models
│   │   │   │   │   ├── repository/ # Repositories
│   │   │   │   │   └── local/     # Local storage
│   │   │   │   ├── domain/        # Business logic
│   │   │   │   │   ├── model/     # Domain models
│   │   │   │   │   ├── repository/ # Repository interfaces
│   │   │   │   │   └── usecase/   # Use cases
│   │   │   │   ├── presentation/  # UI layer
│   │   │   │   │   ├── ui/        # Compose screens
│   │   │   │   │   ├── viewmodel/ # ViewModels
│   │   │   │   │   ├── navigation/ # Navigation
│   │   │   │   │   └── theme/     # UI theme
│   │   │   │   ├── di/            # Dependency injection
│   │   │   │   └── utils/         # Utilities
│   │   │   └── res/               # Resources
│   │   └── androidTest/           # Tests
│   └── build.gradle.kts
├── build.gradle.kts
└── gradle/
```

## 🚀 Quick Start

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- JDK 17 or later
- Android SDK 34
- FreelanceX backend running on http://localhost:5001

### Setup Steps

1. **Open in Android Studio**
   ```bash
   # Open Android Studio
   # File -> Open -> Select freelancex-app folder
   ```

2. **Sync Project**
   ```bash
   # Android Studio will automatically sync Gradle
   # Wait for dependencies to download
   ```

3. **Configure Backend URL**
   ```kotlin
   // In app/src/main/java/com/freelancex/utils/Constants.kt
   const val BASE_URL = "http://10.0.2.2:5001/api/" // For emulator
   // or
   const val BASE_URL = "http://YOUR_IP:5001/api/" // For physical device
   ```

4. **Run the App**
   ```bash
   # Click Run button in Android Studio
   # Or use: ./gradlew installDebug
   ```

## 📱 Screens

### Authentication
- **Login Screen**: Email/password authentication
- **Register Screen**: User registration with role selection

### Main App
- **Home Screen**: Featured services and freelancers
- **Explore Screen**: Browse all services with filters
- **Service Details**: Detailed service information
- **Orders Screen**: Order management and tracking
- **Profile Screen**: User profile and settings

### Navigation
- **Bottom Navigation**: Home, Explore, Orders, Profile
- **Deep Linking**: Support for service and profile links

## 🔐 Authentication Flow

1. **Login/Register** → API call to `/auth/login` or `/auth/register`
2. **Token Storage** → JWT stored securely in EncryptedSharedPreferences
3. **Auto-login** → Check stored token on app start
4. **API Calls** → Add `Authorization: Bearer <token>` header
5. **Token Refresh** → Handle token expiration gracefully

## 🌐 API Integration

### Base Configuration
```kotlin
@GET("services")
suspend fun getServices(
    @Query("category") category: String? = null,
    @Query("search") search: String? = null,
    @Query("page") page: Int = 1
): Response<ServicesResponse>
```

### Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /services` - Get services with filters
- `GET /services/{id}` - Get service details
- `GET /users` - Get freelancers
- `GET /users/{id}` - Get user profile
- `POST /orders` - Create order
- `GET /orders` - Get user orders

## 🎨 UI Design

### Material 3 Theme
- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Purple (#7c3aed)
- **Surface Colors**: Light grays with subtle shadows
- **Typography**: Roboto font family

### Components
- **Cards**: Rounded corners with elevation
- **Buttons**: Material 3 filled and outlined styles
- **Navigation**: Bottom navigation with icons
- **Loading**: Shimmer effects and progress indicators

## 🧪 Testing

### Unit Tests
```bash
./gradlew test
```

### UI Tests
```bash
./gradlew connectedAndroidTest
```

### Manual Testing
1. Test authentication flow
2. Browse services and filters
3. View service details
4. Create and manage orders
5. Update profile information

## 🔧 Configuration

### Build Variants
- **Debug**: Development build with logging
- **Release**: Production build with ProGuard

### Environment Variables
```kotlin
// In BuildConfig
DEBUG_MODE = true/false
BASE_URL = "your-api-url"
```

## 📦 Dependencies

### Core
- Jetpack Compose BOM
- Kotlin Coroutines
- ViewModel & LiveData

### Networking
- Retrofit 2
- OkHttp 3
- Gson Converter

### Dependency Injection
- Hilt Android

### Security
- EncryptedSharedPreferences

### UI
- Material 3
- Compose Navigation
- Coil (Image loading)

## 🚀 Deployment

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

### Play Store
1. Generate signed APK/AAB
2. Upload to Play Console
3. Configure store listing
4. Submit for review

## 🔮 Future Enhancements

### Phase 1 (Ready to Implement)
- Real-time chat with Socket.IO
- Push notifications with FCM
- Offline support with Room database

### Phase 2 (Prepared Structure)
- Payment integration (Stripe/Razorpay)
- Video upload for portfolios
- Advanced search and filters

### Phase 3 (Planned)
- Dark mode support
- Multi-language support
- Biometric authentication

## 🐛 Troubleshooting

### Common Issues

**Network Connection**
```kotlin
// Check if backend is running
// Use correct IP for physical device
// Ensure CORS is configured
```

**Build Errors**
```bash
# Clean and rebuild
./gradlew clean
./gradlew build
```

**Authentication Issues**
```kotlin
// Check token storage
// Verify API endpoints
// Test with Postman first
```

## 📞 Support

### Documentation
- [Android Developer Guide](https://developer.android.com/)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Retrofit Documentation](https://square.github.io/retrofit/)

### Backend API
- Ensure FreelanceX backend is running
- Check API endpoints in Postman
- Verify CORS configuration

## 🎉 Success Criteria

### MVP Complete When:
- ✅ User can login/register
- ✅ Services are displayed and searchable
- ✅ Orders can be created and tracked
- ✅ Profiles are viewable and editable
- ✅ Navigation works smoothly
- ✅ API integration is stable

### Production Ready When:
- ✅ All features tested
- ✅ Error handling implemented
- ✅ Performance optimized
- ✅ Security validated
- ✅ UI/UX polished

---

**Version**: 1.0.0  
**Target SDK**: 34  
**Min SDK**: 24  
**Status**: 🚧 In Development

**Happy Coding!** 📱✨