# FreelanceX App - Testing Guide

## 🧪 Testing Checklist

### Prerequisites
- Android Studio installed
- Android device or emulator (API 24+)
- Project synced and built successfully

---

## 1. Build and Run

### Option A: Using Android Studio
```bash
1. Open Android Studio
2. File → Open → Select freelancex-app folder
3. Wait for Gradle sync to complete
4. Click Run (▶️) button
5. Select device/emulator
```

### Option B: Using Command Line
```bash
cd freelancer-marketplace/freelancex-app
./gradlew clean build
./gradlew installDebug
adb shell am start -n com.freelancex/.MainActivity
```

---

## 2. Authentication Flow Testing

### Test Case 1: Login Screen
- [ ] App opens to Login Screen (after splash)
- [ ] "FreelanceX" branding visible at top
- [ ] "Hire. Work. Grow." tagline visible
- [ ] Email and password fields present
- [ ] Password visibility toggle works
- [ ] "Sign In" button is clickable
- [ ] "Sign Up" link navigates to Register Screen
- [ ] **Demo accounts section is NOT visible** ✅

### Test Case 2: Registration
- [ ] Navigate to Register Screen
- [ ] All fields are present (Name, Email, Password, Confirm Password)
- [ ] Form validation works
- [ ] "Sign Up" button is clickable
- [ ] "Sign In" link navigates back to Login

### Test Case 3: Login Success
- [ ] Enter valid credentials
- [ ] Click Sign In
- [ ] Loading indicator appears
- [ ] Navigates to Main Screen (Home tab)
- [ ] Bottom navigation bar visible

---

## 3. Home Screen Testing

### Test Case 4: Home Screen Layout
- [ ] Header text: "Find the perfect freelancer"
- [ ] Search bar is visible
- [ ] "Browse Categories" section visible
- [ ] 6 category cards displayed horizontally
- [ ] "Featured Services" section visible
- [ ] 5 service cards displayed horizontally
- [ ] "Top Freelancers" section visible
- [ ] 5 freelancer cards displayed horizontally

### Test Case 5: Category Cards
- [ ] Each category shows icon and name
- [ ] Categories: Web Dev, Mobile Dev, UI/UX, Graphic Design, Digital Marketing, Content Writing
- [ ] Click on any category card
- [ ] **Should navigate to Explore tab** ✅
- [ ] Category filter should be applied (future enhancement)

### Test Case 6: Featured Service Cards
- [ ] Each card shows:
  - [ ] Service image (or placeholder)
  - [ ] Service title
  - [ ] Freelancer name (e.g., "by Alex Sharma")
  - [ ] Star rating (e.g., "⭐ 4.9")
  - [ ] **Price in ₹ format** (e.g., "₹15,000") ✅
- [ ] Click on any service card
- [ ] Should navigate to Service Details Screen

### Test Case 7: Top Freelancer Cards
- [ ] Each card shows:
  - [ ] Profile picture (initial-based circle)
  - [ ] Freelancer name
  - [ ] Rating and order count (e.g., "⭐ 4.9 (127)")
  - [ ] **Hourly rate in ₹** (e.g., "₹1,200/hr") ✅
- [ ] Scroll horizontally to see all freelancers

---

## 4. Explore Screen Testing

### Test Case 8: Explore Screen Layout
- [ ] Navigate to Explore tab via bottom nav
- [ ] Header text: "Explore Services"
- [ ] Search bar is visible
- [ ] **8 service listings are displayed** ✅
- [ ] Each service card is visible

### Test Case 9: Service Listings
- [ ] Each service card shows:
  - [ ] Service image
  - [ ] Service title
  - [ ] Freelancer name (e.g., "by Alex Sharma")
  - [ ] Short description (2 lines max)
  - [ ] Star rating
  - [ ] **Price in ₹ format** (e.g., "₹15,000") ✅
- [ ] Services include:
  - [ ] Modern E-commerce Website (₹15,000)
  - [ ] Mobile App UI/UX Design (₹8,500)
  - [ ] Android App Development (₹25,000)
  - [ ] Digital Marketing Strategy (₹12,000)
  - [ ] Logo & Brand Identity (₹5,500)
  - [ ] Content Writing (₹3,500)
  - [ ] WordPress Website (₹9,500)
  - [ ] iOS App Development (₹28,000)

### Test Case 10: Search Functionality
- [ ] Type in search bar (e.g., "website")
- [ ] Results filter in real-time
- [ ] Matching services are shown
- [ ] Non-matching services are hidden
- [ ] Clear search shows all services again

### Test Case 11: Service Card Click
- [ ] Click on any service card
- [ ] Should navigate to Service Details Screen
- [ ] Service ID should be passed correctly

---

## 5. Orders Screen Testing

### Test Case 12: Orders Screen Layout
- [ ] Navigate to Orders tab via bottom nav
- [ ] Header text: "My Orders"
- [ ] Subtitle: "Track and manage your orders"
- [ ] **5 order cards are displayed** ✅

### Test Case 13: Order Cards
- [ ] Each order card shows:
  - [ ] Order ID (e.g., "Order #order_123")
  - [ ] Order date (e.g., "Oct 29, 2025")
  - [ ] **Status badge with color and icon** ✅
  - [ ] Service title
  - [ ] **Freelancer name** (e.g., "Freelancer: Alex Sharma") ✅
  - [ ] **Total amount in ₹** (e.g., "₹15,000") ✅

### Test Case 14: Order Status Badges
- [ ] **Pending orders**: Orange badge 🟠
- [ ] **In Progress orders**: Blue badge 🔵
- [ ] **Completed orders**: Green badge 🟢
- [ ] Each badge has appropriate icon

### Test Case 15: Order Click
- [ ] Click on any order card
- [ ] Should be clickable (ready for Order Details navigation)

---

## 6. Profile Screen Testing

### Test Case 16: Profile Screen Layout
- [ ] Navigate to Profile tab via bottom nav
- [ ] User profile picture/initial visible
- [ ] User name and email displayed
- [ ] Menu options visible:
  - [ ] Edit Profile
  - [ ] Settings
  - [ ] Manage Account
  - [ ] About
  - [ ] Terms & Conditions
  - [ ] Privacy Policy

### Test Case 17: Settings Navigation
- [ ] Click on "Settings"
- [ ] Settings screen opens
- [ ] Back button works

### Test Case 18: Settings Screen
- [ ] "Notifications" section visible
- [ ] Push notifications toggle works
- [ ] "Appearance" section visible
- [ ] **Dark Mode option visible** ✅
- [ ] **"Coming soon" text is NOT visible** ✅
- [ ] **Description: "Switch between light and dark theme"** ✅
- [ ] **Dark Mode toggle is enabled** ✅
- [ ] Toggle switch works (can be turned on/off)
- [ ] "About" section shows app version

### Test Case 19: Manage Account Navigation
- [ ] Click on "Manage Account"
- [ ] Manage Account screen opens
- [ ] Back button works

### Test Case 20: Manage Account Screen
- [ ] "Security" section visible
  - [ ] Change Password option
  - [ ] Two-Factor Authentication option
- [ ] "Privacy" section visible
  - [ ] Privacy Settings option
  - [ ] Blocked Users option
- [ ] "Danger Zone" section visible (red background)
  - [ ] **Logout option** ✅
  - [ ] **Delete Account option** ✅

### Test Case 21: Logout Functionality
- [ ] Click on "Logout"
- [ ] **Confirmation dialog appears** ✅
- [ ] Dialog shows: "Are you sure you want to logout?"
- [ ] "Cancel" button dismisses dialog
- [ ] "Logout" button (red) proceeds
- [ ] **JWT token is cleared** ✅
- [ ] **Navigates to Login Screen** ✅
- [ ] Cannot go back to Main Screen

### Test Case 22: Delete Account Functionality
- [ ] Click on "Delete Account"
- [ ] **Confirmation dialog appears** ✅
- [ ] Dialog shows warning message
- [ ] "This action cannot be undone" warning visible
- [ ] "Cancel" button dismisses dialog
- [ ] "Delete" button (red) proceeds
- [ ] **Calls DELETE /api/users/{id} endpoint** ✅
- [ ] Success toast message appears
- [ ] **Navigates to Login Screen** ✅
- [ ] Cannot go back to Main Screen

---

## 7. Currency Testing

### Test Case 23: Currency Symbol Verification
Check that **₹ (INR)** is used everywhere, NOT $ (USD):

- [ ] **Home Screen**:
  - [ ] Service prices: "₹15,000" format
  - [ ] Freelancer rates: "₹1,200/hr" format
  
- [ ] **Explore Screen**:
  - [ ] All service prices: "₹X,XXX" format
  
- [ ] **Orders Screen**:
  - [ ] All order amounts: "₹X,XXX" format
  
- [ ] **Profile Screen**:
  - [ ] Hourly rate (if displayed): "₹X,XXX/hr" format

### Test Case 24: Number Formatting
- [ ] Prices use comma separators (e.g., ₹15,000 not ₹15000)
- [ ] No decimal places for whole numbers
- [ ] Consistent formatting across all screens

---

## 8. Navigation Testing

### Test Case 25: Bottom Navigation
- [ ] All 4 tabs are visible: Home, Explore, Orders, Profile
- [ ] Icons are appropriate for each tab
- [ ] Clicking each tab switches screen
- [ ] Selected tab is highlighted
- [ ] Tab state is preserved when switching

### Test Case 26: Back Navigation
- [ ] From Edit Profile → Back to Profile
- [ ] From Settings → Back to Profile
- [ ] From Manage Account → Back to Profile
- [ ] From Service Details → Back to previous screen
- [ ] Android back button works correctly

### Test Case 27: Deep Navigation
- [ ] Home → Category → Explore (with filter)
- [ ] Home → Service Card → Service Details
- [ ] Explore → Service Card → Service Details
- [ ] Orders → Order Card → (Ready for Order Details)
- [ ] Profile → Settings → Back
- [ ] Profile → Manage Account → Logout → Login

---

## 9. UI/UX Testing

### Test Case 28: Material 3 Design
- [ ] All cards have rounded corners (12-16dp)
- [ ] Cards have proper elevation/shadows
- [ ] Consistent spacing throughout
- [ ] Typography follows hierarchy
- [ ] Colors follow Material 3 guidelines
- [ ] Touch feedback on clickable items

### Test Case 29: Scrolling
- [ ] Home screen scrolls vertically
- [ ] Category cards scroll horizontally
- [ ] Service cards scroll horizontally
- [ ] Freelancer cards scroll horizontally
- [ ] Explore screen scrolls vertically
- [ ] Orders screen scrolls vertically
- [ ] Smooth scrolling performance

### Test Case 30: Loading States
- [ ] No loading spinners (using dummy data)
- [ ] All data loads instantly
- [ ] No empty states (all screens populated)

### Test Case 31: Empty States
- [ ] If orders were empty, shows "📦 No orders yet"
- [ ] If search has no results, shows "🔍 No services found"
- [ ] Empty states have appropriate emojis and messages

---

## 10. Data Validation Testing

### Test Case 32: Dummy Data Verification
- [ ] **5 freelancers** displayed in Top Freelancers
- [ ] **8 services** displayed in Explore
- [ ] **5 orders** displayed in Orders
- [ ] All data is realistic and Indian-context
- [ ] Names: Alex Sharma, Priya Patel, Raj Kumar, etc.
- [ ] Locations: Mumbai, Bangalore, Delhi, Pune, Jaipur
- [ ] Skills are relevant to categories

### Test Case 33: Service Data
- [ ] Services span multiple categories
- [ ] Prices range from ₹3,500 to ₹28,000
- [ ] Ratings range from 4.6 to 4.9
- [ ] Delivery times are realistic (3-15 days)
- [ ] Tags are relevant to services

### Test Case 34: Order Data
- [ ] Orders have different statuses
- [ ] Timestamps are realistic (1 day to 2 weeks ago)
- [ ] Order amounts match service prices
- [ ] Freelancer names match service creators

---

## 11. Edge Cases Testing

### Test Case 35: Long Text Handling
- [ ] Long service titles truncate with ellipsis (...)
- [ ] Long descriptions truncate to 2 lines
- [ ] Long freelancer names truncate properly
- [ ] No text overflow issues

### Test Case 36: Network Scenarios
- [ ] App works offline (using dummy data)
- [ ] No network errors displayed
- [ ] Images show placeholders if URLs fail

### Test Case 37: Device Rotation
- [ ] Rotate device to landscape
- [ ] Layout adjusts properly
- [ ] No data loss
- [ ] Rotate back to portrait
- [ ] Everything still works

---

## 12. Performance Testing

### Test Case 38: App Performance
- [ ] App launches quickly (< 3 seconds)
- [ ] Screen transitions are smooth
- [ ] No lag when scrolling
- [ ] No memory leaks
- [ ] Battery usage is reasonable

### Test Case 39: Memory Usage
- [ ] Check Android Studio Profiler
- [ ] Memory usage is stable
- [ ] No memory spikes
- [ ] GC (Garbage Collection) is normal

---

## 13. Regression Testing

### Test Case 40: Previous Features
- [ ] Login still works
- [ ] Registration still works
- [ ] Profile editing still works
- [ ] All existing features intact

---

## 🐛 Bug Reporting Template

If you find any issues, report them using this format:

```
**Bug Title**: [Short description]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[Attach screenshots if applicable]

**Device Info**:
- Device: [e.g., Pixel 5]
- Android Version: [e.g., Android 12]
- App Version: 1.0.0

**Severity**:
- [ ] Critical (App crashes)
- [ ] High (Feature doesn't work)
- [ ] Medium (UI issue)
- [ ] Low (Minor cosmetic issue)
```

---

## ✅ Test Results Summary

After completing all tests, fill out this summary:

```
Total Test Cases: 40
Passed: ___
Failed: ___
Skipped: ___

Pass Rate: ___%

Critical Issues: ___
High Priority Issues: ___
Medium Priority Issues: ___
Low Priority Issues: ___

Overall Status: [PASS / FAIL / NEEDS WORK]

Tester Name: ___________
Date: ___________
```

---

## 📝 Notes

- All tests should be performed on both emulator and physical device
- Test on different Android versions (API 24-33)
- Test on different screen sizes (phone, tablet)
- Document any unexpected behavior
- Take screenshots of issues
- Report all bugs immediately

---

## 🎯 Success Criteria

The app is considered **READY FOR RELEASE** when:

✅ All 40 test cases pass
✅ No critical or high-priority bugs
✅ Pass rate > 95%
✅ Performance is acceptable
✅ UI/UX is polished
✅ All requested features implemented
✅ Currency is ₹ everywhere
✅ Demo accounts removed
✅ Dark mode toggle works
✅ Logout/Delete account works

---

**Happy Testing! 🚀**
