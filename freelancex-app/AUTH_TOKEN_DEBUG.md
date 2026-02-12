# Auth Token Debugging Guide

## Current Setup ✅

The app is correctly configured:

1. **TokenManager** - Stores token securely in EncryptedSharedPreferences
2. **AuthInterceptor** - Automatically adds `Authorization: Bearer <token>` to ALL requests
3. **Login/Register** - Saves token using `tokenManager.saveAuthToken()`

## Why "Invalid user session" Error?

### Possible Causes:

1. **Token Expired** - JWT tokens have expiration times
2. **Backend Validation** - Backend might be rejecting the token format
3. **Token Not Saved** - Login might have failed silently
4. **Wrong Endpoint** - Order creation endpoint might expect different auth

## Debug Steps

### Step 1: Check if Token is Saved

Add logging to see if token exists:

In `OrderViewModel.kt` or `CreateOrderScreen.kt`, add:
```kotlin
val token = tokenManager.getAuthToken()
android.util.Log.d("OrderDebug", "Token exists: ${!token.isNullOrEmpty()}")
android.util.Log.d("OrderDebug", "Token: ${token?.take(20)}...")  // First 20 chars
```

### Step 2: Check Logcat for HTTP Requests

The app has HTTP logging enabled. In Logcat, filter by "OkHttp" to see:
```
D/OkHttp: --> POST /api/orders
D/OkHttp: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
D/OkHttp: <-- 401 Unauthorized
```

### Step 3: Verify Token Format

The backend expects:
```
Authorization: Bearer <jwt_token>
```

The AuthInterceptor adds this automatically via:
```kotlin
tokenManager.getAuthorizationHeader()  // Returns "Bearer <token>"
```

### Step 4: Test Token Manually

Get the token from Logcat and test it:
```bash
curl -X POST https://freelancex-backend.vercel.app/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "...",
    "clientId": "...",
    "freelancerId": "...",
    "requirements": "..."
  }'
```

## Common Fixes

### Fix 1: Re-login

If token expired:
1. Logout from app
2. Login again
3. Try creating order

### Fix 2: Check Backend Token Validation

The backend might be:
- Checking token expiration
- Validating token signature
- Requiring specific user role

### Fix 3: Add Better Error Handling

In `OrderRepositoryImpl.kt`, add logging:
```kotlin
override suspend fun createOrder(request: CreateOrderRequest): Resource<Order> {
    return try {
        android.util.Log.d("OrderRepo", "Creating order with token: ${tokenManager.getAuthToken()?.take(20)}")
        
        val response = api.createOrder(request)
        
        android.util.Log.d("OrderRepo", "Response code: ${response.code()}")
        android.util.Log.d("OrderRepo", "Response body: ${response.body()}")
        android.util.Log.d("OrderRepo", "Response error: ${response.errorBody()?.string()}")
        
        // ... rest of code
    } catch (e: Exception) {
        android.util.Log.e("OrderRepo", "Exception: ${e.message}", e)
        Resource.Error(e.message ?: "Unknown error")
    }
}
```

## Expected Behavior

When creating an order, the flow should be:

1. User clicks "Confirm Order"
2. `OrderViewModel.createOrder()` is called
3. `OrderRepositoryImpl.createOrder()` makes API call
4. `AuthInterceptor.intercept()` adds Authorization header automatically
5. Backend receives request with valid token
6. Order is created successfully

## Verify Setup

Check these files are correct:

### 1. TokenManager.kt ✅
```kotlin
fun getAuthorizationHeader(): String? {
    val token = getAuthToken()
    return if (token != null) "Bearer $token" else null
}
```

### 2. AuthInterceptor.kt ✅
```kotlin
val authHeader = tokenManager.getAuthorizationHeader()
if (authHeader != null) {
    originalRequest.newBuilder()
        .addHeader("Authorization", authHeader)
        .build()
}
```

### 3. NetworkModule.kt ✅
```kotlin
OkHttpClient.Builder()
    .addInterceptor(authInterceptor)  // ← Must be added
    .addInterceptor(loggingInterceptor)
    .build()
```

### 4. AuthRepositoryImpl.kt ✅
```kotlin
tokenManager.saveAuthToken(
    token = authResponse.token,
    userId = user.id,
    userRole = role,
    userEmail = user.email
)
```

## Quick Test

To verify the token is working:

1. Login to the app
2. Open Logcat
3. Filter by "OkHttp"
4. Try to create an order
5. Look for the Authorization header in the logs

If you see:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Then the token IS being sent. The issue is backend validation.

If you DON'T see the Authorization header, then:
- Token wasn't saved during login
- TokenManager.getAuthToken() returns null
- Need to re-login

## Next Steps

1. Check Logcat for the actual error response from backend
2. Verify token is being sent in Authorization header
3. Test the token manually with curl
4. Share the exact error message from backend for specific fix
