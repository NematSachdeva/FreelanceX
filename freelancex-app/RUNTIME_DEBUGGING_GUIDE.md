# Runtime Debugging Guide

## Issues Reported
1. ❌ App crashes when clicking on freelancer name
2. ❌ Services show "failed to load" error

## Quick Checks

### 1. Check Backend is Running
Your app is configured to use: `https://freelancex-backend.vercel.app/api/`

Test the backend:
```bash
# Test if backend is accessible
curl https://freelancex-backend.vercel.app/api/services

# Or open in browser:
https://freelancex-backend.vercel.app/api/services
```

### 2. Check Logcat for Errors

In Android Studio:
1. Open **Logcat** (View > Tool Windows > Logcat)
2. Filter by your package: `com.freelancex`
3. Look for errors when:
   - App starts (services loading)
   - Clicking on freelancer

Common error patterns to look for:
- `JsonSyntaxException` - JSON parsing error
- `ConnectException` - Backend not reachable
- `NullPointerException` - Missing data
- `IllegalArgumentException` - Invalid navigation arguments

### 3. Services "Failed to Load" - Possible Causes

#### A. Backend Not Running
**Solution:** Ensure your backend is deployed and accessible

#### B. Network Permission Missing
Check `AndroidManifest.xml` has:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

#### C. JSON Parsing Error
The backend might be returning data in a different format than expected.

**Check the actual API response:**
```bash
curl https://freelancex-backend.vercel.app/api/services
```

Expected format:
```json
{
  "services": [
    {
      "_id": "string",
      "title": "string",
      "freelancerId": "string",  // ← Should be STRING, not object
      ...
    }
  ]
}
```

#### D. CORS or SSL Issues
If using local backend, you might need to:
1. Change BASE_URL to use HTTP (not HTTPS) for local
2. Update `build.gradle.kts`:
```kotlin
buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:5001/api/\"")
```

### 4. Freelancer Click Crash - Possible Causes

#### A. Navigation Argument Issue
Check if FreelancerProfileScreen expects correct parameter type.

**To Debug:**
1. Open `FreelancerProfileScreen.kt`
2. Check the parameter it receives
3. Check how it's being called in navigation

#### B. Missing Freelancer Data
The freelancer ID might not exist in the backend.

**To Debug:**
Add logging in `FreelancerViewModel.kt`:
```kotlin
fun loadFreelancer(freelancerId: String) {
    android.util.Log.d("FreelancerViewModel", "Loading freelancer: $freelancerId")
    // ... rest of code
}
```

## Step-by-Step Debugging

### Step 1: Enable Detailed Logging

The app already has HTTP logging enabled in debug mode. Check Logcat for:
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/services
D/OkHttp: <-- 200 OK (response body)
```

### Step 2: Test Backend Endpoints

Test each endpoint your app uses:

```bash
# 1. Get Services
curl https://freelancex-backend.vercel.app/api/services

# 2. Get Users/Freelancers
curl https://freelancex-backend.vercel.app/api/users?role=freelancer

# 3. Get Specific User
curl https://freelancex-backend.vercel.app/api/users/{userId}
```

### Step 3: Check Data Models Match Backend

Verify the Service model matches backend response:
- `freelancerId` should be `String?` ✅ (Already fixed)
- `createdBy` should be `String?` ✅ (Already fixed)

### Step 4: Add Error Handling

If services fail to load, check `HomeViewModel.kt` and `ExploreViewModel.kt` for error messages.

## Common Fixes

### Fix 1: Backend URL for Emulator
If running backend locally and using emulator:

```kotlin
// In build.gradle.kts
buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:5001/api/\"")
```

### Fix 2: Backend URL for Physical Device
If running backend locally and using physical device:

```kotlin
// In build.gradle.kts
// Replace with your computer's IP address
buildConfigField("String", "BASE_URL", "\"http://192.168.1.XXX:5001/api/\"")
```

### Fix 3: Clear App Data
Sometimes cached data causes issues:
1. Settings > Apps > FreelanceX > Storage > Clear Data
2. Or uninstall and reinstall the app

### Fix 4: Rebuild Project
```bash
./gradlew clean
./gradlew assembleDebug
```

## What to Share for Further Help

If issues persist, please share:

1. **Logcat output** when:
   - App starts
   - Services fail to load
   - App crashes on freelancer click

2. **Backend API response**:
```bash
curl https://freelancex-backend.vercel.app/api/services
```

3. **Specific error message** from the app or Logcat

## Quick Test

To verify the app works with dummy data:

1. The app has `DummyData.kt` with sample data
2. Temporarily switch to use dummy data instead of API
3. If it works with dummy data, the issue is backend-related
4. If it still crashes, the issue is in the app code

## Next Steps

1. Check Logcat for the exact error
2. Test backend endpoints
3. Share the error details for specific fix
