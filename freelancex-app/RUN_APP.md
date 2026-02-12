# How to Run the FreelanceX Android App

## The Issue
You ran `connectedDebugAndroidTest` which tries to run instrumentation tests. Since we don't have tests yet, it crashes. That's normal.

## How to Actually Run the App

### Option 1: Using Gradle (Recommended)
```bash
cd freelancer-marketplace/freelancex-app
./gradlew installDebug
```

This will:
1. Build the APK
2. Install it on your connected emulator/device
3. Then manually launch the app from the emulator

### Option 2: Build and Install in One Command
```bash
./gradlew installDebug && adb shell am start -n com.freelancex/.MainActivity
```

This will build, install, AND launch the app automatically.

### Option 3: Use Android Studio
1. Open the project in Android Studio
2. Make sure your emulator is running (Medium_Phone_API_36.1 is already running)
3. Click the green "Run" button (▶️) or press Shift+F10
4. Select your emulator from the device list

## Verify Emulator is Running
```bash
adb devices
```

You should see `emulator-5554` listed.

## Test Credentials
Once the app launches:
- Email: `alex@freelancex.com`
- Password: `password123`

## Notes
- The app is already compiled successfully
- Your emulator is running (Medium_Phone_API_36.1)
- Don't run `connectedDebugAndroidTest` unless you want to run tests
- Use `installDebug` to install and run the actual app
