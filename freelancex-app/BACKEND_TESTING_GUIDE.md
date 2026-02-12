# Backend Testing Guide

## 🧪 Testing FreelanceX App with Production Backend

---

## 🔗 Backend Information

**Production URL:** https://freelancex-backend.vercel.app/api/

**Test Credentials:**
- **Freelancer Account:**
  - Email: `alex@freelancex.com`
  - Password: `password123`
  
- **Client Account:**
  - Email: `john@client.com`
  - Password: `password123`

---

## 📱 Step-by-Step Testing

### 1. Build and Install App

```bash
cd freelancer-marketplace/freelancex-app

# Clean previous builds
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Install on device/emulator
./gradlew installDebug
```

Or in Android Studio:
1. Build → Clean Project
2. Build → Rebuild Project
3. Run → Run 'app'

---

### 2. Test Authentication

#### Login Test
1. Open the app
2. You should see the Login screen
3. Enter credentials:
   - Email: `alex@freelancex.com`
   - Password: `password123`
4. Click "Sign In"

**Expected Result:**
- ✅ Loading indicator appears
- ✅ Successfully logs in
- ✅ Navigates to Home screen
- ✅ JWT token saved

**Check Logcat:**
```
D/OkHttp: --> POST https://freelancex-backend.vercel.app/api/auth/login
D/OkHttp: <-- 200 OK
```

#### Registration Test
1. Click "Sign Up" link
2. Fill in registration form
3. Click "Sign Up"

**Expected Result:**
- ✅ Account created
- ✅ Automatically logged in
- ✅ Navigates to Home screen

---

### 3. Test Home Screen

1. After login, you should be on Home screen
2. Observe the following sections:
   - Search bar
   - Browse Categories (6 cards)
   - Featured Services (horizontal scroll)
   - Top Freelancers (horizontal scroll)

**Expected Result:**
- ✅ Categories display correctly
- ✅ Featured services load from backend
- ✅ Top freelancers load from backend
- ✅ All prices show in ₹ format
- ✅ Images load (or show placeholders)

**Check Logcat:**
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/services/featured
D/OkHttp: <-- 200 OK
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/users/top
D/OkHttp: <-- 200 OK
```

---

### 4. Test Explore Screen

1. Navigate to Explore tab (bottom navigation)
2. Services should load automatically

**Expected Result:**
- ✅ Services list displays
- ✅ Each service shows:
  - Title
  - Freelancer name
  - Price (₹ format)
  - Rating
  - Description
- ✅ Search bar is functional
- ✅ Can scroll through services

**Test Search:**
1. Type "website" in search bar
2. Results should filter in real-time

**Expected Result:**
- ✅ Search works
- ✅ Results update dynamically

**Check Logcat:**
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/services
D/OkHttp: <-- 200 OK
```

---

### 5. Test Service Details

1. From Home or Explore, click any service card
2. Service Details screen should open

**Expected Result:**
- ✅ Service image displays
- ✅ Service title and category
- ✅ Freelancer info card with avatar
- ✅ Rating and review count
- ✅ Full description
- ✅ Delivery time
- ✅ Orders completed count
- ✅ Skills tags
- ✅ Price in ₹ format
- ✅ "Order Now" button visible

**Check Logcat:**
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/services/{id}
D/OkHttp: <-- 200 OK
```

---

### 6. Test Orders Screen

1. Navigate to Orders tab (bottom navigation)
2. Orders should load from backend

**Expected Result:**
- ✅ Orders list displays
- ✅ Each order shows:
  - Order ID
  - Service name
  - Freelancer name
  - Status badge (colored)
  - Total amount (₹ format)
  - Order date
- ✅ Can click on orders

**Check Logcat:**
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/orders
D/OkHttp: <-- 200 OK
```

---

### 7. Test Order Details

1. From Orders screen, click any order card
2. Order Details screen should open

**Expected Result:**
- ✅ Order ID and status badge
- ✅ Service info card
- ✅ Freelancer info card
- ✅ Order details (amount, dates)
- ✅ Requirements section (if available)
- ✅ Status timeline with visual indicators
- ✅ "Contact Freelancer" button

**Check Logcat:**
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/orders/{id}
D/OkHttp: <-- 200 OK
```

---

### 8. Test Profile Screen

1. Navigate to Profile tab (bottom navigation)
2. Profile should load from backend

**Expected Result:**
- ✅ User avatar/initial displays
- ✅ User name and email
- ✅ Menu options visible:
  - Edit Profile
  - Settings
  - Manage Account
  - About
  - Terms & Conditions
  - Privacy Policy

**Check Logcat:**
```
D/OkHttp: --> GET https://freelancex-backend.vercel.app/api/users/profile/me
D/OkHttp: <-- 200 OK
```

---

### 9. Test Edit Profile

1. From Profile, click "Edit Profile"
2. Update information (name, bio, skills, etc.)
3. Click "Save"

**Expected Result:**
- ✅ Form loads with current data
- ✅ Can edit fields
- ✅ Save button works
- ✅ Success message appears
- ✅ Profile updates on backend
- ✅ Returns to Profile screen

**Check Logcat:**
```
D/OkHttp: --> PUT https://freelancex-backend.vercel.app/api/users/profile
D/OkHttp: <-- 200 OK
```

---

### 10. Test Dark Mode

1. Navigate to Profile → Settings
2. Toggle "Dark Mode" switch

**Expected Result:**
- ✅ Theme changes immediately
- ✅ All screens update to dark theme
- ✅ Close and reopen app
- ✅ Dark mode persists

---

### 11. Test Logout

1. Navigate to Profile → Manage Account
2. Click "Logout"
3. Confirm in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Logout successful
- ✅ JWT token cleared
- ✅ Navigates to Login screen
- ✅ Cannot go back to Main screen

**Check Logcat:**
```
D/OkHttp: --> POST https://freelancex-backend.vercel.app/api/auth/logout
D/OkHttp: <-- 200 OK
```

---

## 🔍 Debugging Tips

### View Network Logs

In Android Studio Logcat:
1. Filter by "OkHttp"
2. You should see all API requests and responses
3. Check for:
   - Request URLs
   - Request headers (including Authorization)
   - Request body
   - Response status codes
   - Response body

### Common Issues

#### Issue: "Unable to resolve host"
**Cause:** No internet connection
**Solution:** 
- Check device/emulator internet connection
- Try opening https://freelancex-backend.vercel.app in browser

#### Issue: "Connection timeout"
**Cause:** Backend is slow or down
**Solution:**
- Check backend status: https://freelancex-backend.vercel.app
- Wait and retry
- Check Vercel deployment status

#### Issue: "401 Unauthorized"
**Cause:** Invalid or expired token
**Solution:**
- Logout and login again
- Check if token is being sent in headers

#### Issue: "404 Not Found"
**Cause:** Incorrect endpoint
**Solution:**
- Check API endpoint in FreelanceXApi.kt
- Verify BASE_URL has trailing slash
- Check backend API documentation

#### Issue: "Empty data / No services"
**Cause:** Backend database is empty
**Solution:**
- Check backend has data
- Test API directly: https://freelancex-backend.vercel.app/api/services
- Seed database if needed

---

## ✅ Success Criteria

The backend integration is successful if:

- [x] Login works with backend credentials
- [x] Services load from production database
- [x] User profile loads correctly
- [x] Orders display from backend
- [x] Search functionality works
- [x] Profile updates save to backend
- [x] Service details load correctly
- [x] Order details load correctly
- [x] Logout clears token
- [x] Dark mode persists
- [x] All prices show ₹ symbol
- [x] No localhost URLs in logs
- [x] All API calls use HTTPS

---

## 📊 Performance Expectations

### Network Response Times
- Login: < 2 seconds
- Load services: < 3 seconds
- Load profile: < 2 seconds
- Load orders: < 3 seconds
- Update profile: < 2 seconds

### Data Loading
- Services: Should load 8+ items
- Orders: Should load user's orders
- Freelancers: Should load 5+ items
- Profile: Should load complete user data

---

## 🎯 Test Scenarios

### Scenario 1: New User Journey
1. Open app
2. Click "Sign Up"
3. Register new account
4. Explore services
5. View service details
6. Navigate through all tabs
7. Update profile
8. Logout

### Scenario 2: Returning User Journey
1. Open app
2. Login with existing credentials
3. Check orders
4. View order details
5. Search for services
6. View service details
7. Update profile
8. Toggle dark mode
9. Logout

### Scenario 3: Freelancer Journey
1. Login as freelancer (alex@freelancex.com)
2. View profile
3. Check orders (as seller)
4. Browse services
5. Update profile with skills
6. Logout

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________
Device: ___________
Android Version: ___________

✅ Authentication
- [ ] Login works
- [ ] Registration works
- [ ] Logout works

✅ Home Screen
- [ ] Categories display
- [ ] Featured services load
- [ ] Top freelancers load

✅ Explore Screen
- [ ] Services list loads
- [ ] Search works
- [ ] Service details open

✅ Orders Screen
- [ ] Orders list loads
- [ ] Order details open
- [ ] Status badges correct

✅ Profile Screen
- [ ] Profile loads
- [ ] Edit profile works
- [ ] Settings accessible

✅ Dark Mode
- [ ] Toggle works
- [ ] Persists across restarts

✅ Network
- [ ] All API calls use production URL
- [ ] No localhost in logs
- [ ] HTTPS enforced

Issues Found:
1. ___________
2. ___________
3. ___________

Overall Status: [ ] PASS [ ] FAIL
```

---

**Happy Testing! 🚀**
