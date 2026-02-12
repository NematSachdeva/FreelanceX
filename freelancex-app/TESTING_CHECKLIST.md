# Testing Checklist - Phase 1 & Phase 2

## Pre-Testing Setup

1. **Backend Status:**
   - ✅ Backend URL: https://freelancex-backend.vercel.app/api
   - ✅ Ensure backend is running and accessible

2. **App Setup:**
   - ✅ Clean and rebuild the app
   - ✅ Clear app data if testing fresh install
   - ✅ Have test credentials ready

---

## 1. HOME SCREEN TESTS

### Test 1.1: Initial Load
- [ ] Open app after login
- [ ] Verify loading indicators appear
- [ ] Verify featured services load (real data)
- [ ] Verify top freelancers load (real data)
- [ ] Verify all prices show ₹ (INR) not $

### Test 1.2: Categories
- [ ] Verify 6 categories displayed
- [ ] Click any category card
- [ ] Verify navigates to Explore with category filter
- [ ] Verify filtered results shown

### Test 1.3: Featured Services
- [ ] Verify 5 services displayed
- [ ] Click "View All" button
- [ ] Verify navigates to Explore screen
- [ ] Click any service card
- [ ] Verify navigates to Service Details

### Test 1.4: Top Freelancers
- [ ] Verify 5 freelancers displayed
- [ ] Click "View All" button
- [ ] Verify navigates to Top Freelancers screen
- [ ] Click any freelancer card
- [ ] Verify navigates to Freelancer Profile

### Test 1.5: Error Handling
- [ ] Turn off WiFi/data
- [ ] Pull to refresh or restart app
- [ ] Verify error message shown
- [ ] Click "Retry" button
- [ ] Turn on WiFi/data
- [ ] Verify data loads successfully

---

## 2. EXPLORE SCREEN TESTS

### Test 2.1: Service Listing
- [ ] Navigate to Explore tab
- [ ] Verify loading indicator appears
- [ ] Verify real services load from backend
- [ ] Verify all prices show ₹ (INR)
- [ ] Scroll through list
- [ ] Verify images load properly

### Test 2.2: Search Functionality
- [ ] Type in search box: "web"
- [ ] Verify results filter in real-time
- [ ] Clear search
- [ ] Verify all services shown again

### Test 2.3: Category Filter
- [ ] Navigate from Home with category filter
- [ ] Verify only services in that category shown
- [ ] Click "Clear Filter" button
- [ ] Verify all services shown

### Test 2.4: Service Navigation
- [ ] Click any service card
- [ ] Verify navigates to Service Details
- [ ] Verify correct service data shown

### Test 2.5: Empty State
- [ ] Search for "xyzabc123" (non-existent)
- [ ] Verify "No services found" message
- [ ] Clear search
- [ ] Verify services reappear

---

## 3. SERVICE DETAILS TESTS

### Test 3.1: Service Information
- [ ] Open any service
- [ ] Verify loading indicator appears
- [ ] Verify service title, description load
- [ ] Verify service image loads
- [ ] Verify price shows ₹ (INR)
- [ ] Verify rating and review count shown
- [ ] Verify category displayed
- [ ] Verify freelancer info shown

### Test 3.2: Order Now Flow
- [ ] Click "Order Now" button
- [ ] Verify navigates to Create Order screen
- [ ] Verify service and freelancer info pre-filled
- [ ] Verify price shown correctly

### Test 3.3: Error Handling
- [ ] Open service with invalid ID (manually test)
- [ ] Verify error message shown
- [ ] Click "Retry" button
- [ ] Verify proper handling

---

## 4. CREATE ORDER TESTS

### Test 4.1: Order Form
- [ ] Open Create Order screen
- [ ] Verify service info card shown
- [ ] Verify freelancer info shown
- [ ] Verify price displayed correctly (₹)
- [ ] Type requirements (minimum 10 characters)
- [ ] Select delivery time from dropdown
- [ ] Verify order summary updates

### Test 4.2: Order Submission
- [ ] Fill all required fields
- [ ] Click "Confirm Order" button
- [ ] Verify loading indicator appears
- [ ] Verify success toast message
- [ ] Verify navigates to Orders screen
- [ ] Verify new order appears in list

### Test 4.3: Validation
- [ ] Try to submit without requirements
- [ ] Verify error toast shown
- [ ] Fill requirements
- [ ] Verify button becomes enabled

---

## 5. ORDERS SCREEN TESTS

### Test 5.1: Orders List
- [ ] Navigate to Orders tab
- [ ] Verify loading indicator appears
- [ ] Verify real orders load from backend
- [ ] Verify all prices show ₹ (INR)
- [ ] Verify order status badges shown correctly
- [ ] Verify order dates formatted properly

### Test 5.2: Order Details Navigation
- [ ] Click any order card
- [ ] Verify navigates to Order Details
- [ ] Verify correct order data shown

### Test 5.3: Empty State
- [ ] Test with account that has no orders
- [ ] Verify "No orders yet" message shown
- [ ] Verify icon and helpful text displayed

### Test 5.4: Order Status Colors
- [ ] Verify PENDING orders show orange badge
- [ ] Verify IN_PROGRESS orders show blue badge
- [ ] Verify COMPLETED orders show green badge
- [ ] Verify CANCELLED orders show red badge

---

## 6. ORDER DETAILS TESTS

### Test 6.1: Order Information
- [ ] Open any order
- [ ] Verify loading indicator appears
- [ ] Verify order ID shown (last 8 chars)
- [ ] Verify service title shown
- [ ] Verify freelancer name shown
- [ ] Verify total amount shows ₹ (INR)
- [ ] Verify order date formatted properly
- [ ] Verify status badge shown correctly

### Test 6.2: Contact Freelancer
- [ ] Click "Contact Freelancer" button
- [ ] Verify email app opens
- [ ] Verify freelancer's email in "To" field
- [ ] Verify subject line includes order ID
- [ ] Verify email body has greeting

### Test 6.3: Status Timeline
- [ ] Verify status timeline shown
- [ ] Verify completed steps highlighted
- [ ] Verify current step indicated
- [ ] For cancelled orders, verify cancellation notice

### Test 6.4: Requirements Display
- [ ] Verify requirements/message shown
- [ ] Verify text is readable and formatted

---

## 7. FREELANCER PROFILE TESTS

### Test 7.1: Profile Information
- [ ] Open any freelancer profile
- [ ] Verify loading indicator appears
- [ ] Verify freelancer name shown
- [ ] Verify email shown
- [ ] Verify rating and order count shown
- [ ] Verify hourly rate shows ₹ (INR)
- [ ] Verify bio displayed (if available)
- [ ] Verify skills displayed
- [ ] Verify location shown (if available)

### Test 7.2: Hire Button
- [ ] Click "Hire" button
- [ ] Verify navigates to order creation
- [ ] Verify freelancer's service pre-selected

### Test 7.3: Stats Cards
- [ ] Verify "Completed" stat shown
- [ ] Verify "Hourly Rate" stat shown
- [ ] Verify both cards display correctly

---

## 8. TOP FREELANCERS SCREEN TESTS

### Test 8.1: Freelancers List
- [ ] Navigate from Home "View All"
- [ ] Verify loading indicator appears
- [ ] Verify real freelancers load
- [ ] Verify all hourly rates show ₹ (INR)
- [ ] Scroll through list
- [ ] Verify avatars/images load

### Test 8.2: Freelancer Navigation
- [ ] Click any freelancer card
- [ ] Verify navigates to Freelancer Profile
- [ ] Verify correct freelancer data shown

---

## 9. PROFILE & SETTINGS TESTS

### Test 9.1: Edit Profile
- [ ] Navigate to Profile tab
- [ ] Click "Edit Profile"
- [ ] Update name
- [ ] Update bio
- [ ] Update location
- [ ] Update hourly rate
- [ ] Click "Save Changes"
- [ ] Verify loading indicator appears
- [ ] Verify success toast shown
- [ ] Verify navigates back to profile
- [ ] Verify changes reflected in profile

### Test 9.2: Dark Mode Toggle
- [ ] Navigate to Settings
- [ ] Toggle "Dark Mode" switch
- [ ] Verify theme changes immediately
- [ ] Toggle back to light mode
- [ ] Verify theme changes back
- [ ] Close and reopen app
- [ ] Verify theme preference persisted

### Test 9.3: Logout
- [ ] Navigate to Manage Account
- [ ] Click "Logout"
- [ ] Verify confirmation dialog shown
- [ ] Click "Logout" in dialog
- [ ] Verify navigates to Login screen
- [ ] Verify cannot navigate back to main app
- [ ] Try to login again
- [ ] Verify login works

### Test 9.4: Delete Account
- [ ] Navigate to Manage Account
- [ ] Click "Delete Account"
- [ ] Verify confirmation dialog shown
- [ ] Click "Cancel" first
- [ ] Verify dialog closes
- [ ] Click "Delete Account" again
- [ ] Click "Delete" in dialog
- [ ] Verify account deleted
- [ ] Verify navigates to Login screen

---

## 10. CURRENCY FORMATTING TESTS

### Test 10.1: Verify INR Throughout
- [ ] Home screen services: ₹5,000 format
- [ ] Explore screen services: ₹5,000 format
- [ ] Service details: ₹5,000 format
- [ ] Create order: ₹5,000 format
- [ ] Orders list: ₹5,000 format
- [ ] Order details: ₹5,000 format
- [ ] Freelancer hourly rate: ₹500/hr format
- [ ] Top freelancers: ₹500/hr format

### Test 10.2: Verify No Dollar Signs
- [ ] Search entire app for "$" symbol
- [ ] Verify none found in any screen
- [ ] Verify all prices use "₹" symbol

---

## 11. ERROR HANDLING TESTS

### Test 11.1: Network Errors
- [ ] Turn off WiFi/data
- [ ] Try to load Home screen
- [ ] Verify error message shown
- [ ] Verify "Retry" button shown
- [ ] Turn on WiFi/data
- [ ] Click "Retry"
- [ ] Verify data loads

### Test 11.2: Invalid Data
- [ ] Try to access non-existent service ID
- [ ] Verify error message shown
- [ ] Try to access non-existent order ID
- [ ] Verify error message shown
- [ ] Try to access non-existent freelancer ID
- [ ] Verify error message shown

### Test 11.3: JWT Expiration
- [ ] Wait for JWT to expire (or manually expire)
- [ ] Try to make API call
- [ ] Verify redirects to login
- [ ] Login again
- [ ] Verify can access app again

---

## 12. NAVIGATION TESTS

### Test 12.1: Back Navigation
- [ ] Navigate deep into app (Home → Service → Order)
- [ ] Press back button
- [ ] Verify navigates to previous screen
- [ ] Continue pressing back
- [ ] Verify reaches Home screen
- [ ] Press back on Home
- [ ] Verify app exits or shows exit dialog

### Test 12.2: Bottom Navigation
- [ ] Click each bottom nav item
- [ ] Verify correct screen shown
- [ ] Verify selected item highlighted
- [ ] Navigate within a tab
- [ ] Switch to another tab
- [ ] Switch back to first tab
- [ ] Verify state preserved (or reset as designed)

---

## 13. LOADING STATES TESTS

### Test 13.1: Verify Loading Indicators
- [ ] Home screen: Shows loading for services and freelancers
- [ ] Explore screen: Shows loading for services
- [ ] Service details: Shows loading for service data
- [ ] Orders screen: Shows loading for orders
- [ ] Order details: Shows loading for order data
- [ ] Freelancer profile: Shows loading for freelancer data
- [ ] Top freelancers: Shows loading for freelancers list

### Test 13.2: Verify Loading Behavior
- [ ] Verify loading indicators are centered
- [ ] Verify loading indicators are appropriate size
- [ ] Verify loading doesn't block UI unnecessarily
- [ ] Verify loading clears after data loads

---

## 14. EMPTY STATES TESTS

### Test 14.1: Verify Empty States
- [ ] Orders screen with no orders
- [ ] Explore screen with no results
- [ ] Top freelancers with no data
- [ ] Search with no results

### Test 14.2: Verify Empty State Messages
- [ ] Verify helpful icons shown
- [ ] Verify clear messages displayed
- [ ] Verify suggestions provided (where applicable)

---

## SUMMARY CHECKLIST

### Critical Functionality:
- [ ] All screens load real backend data
- [ ] All prices show ₹ (INR) not $
- [ ] All navigation flows work correctly
- [ ] Order creation and management works
- [ ] Profile editing saves to backend
- [ ] Logout clears JWT and returns to login
- [ ] Dark mode toggle works
- [ ] Contact freelancer opens email app
- [ ] All loading states work
- [ ] All error states work with retry
- [ ] All empty states work

### Performance:
- [ ] App loads quickly
- [ ] Images load smoothly
- [ ] No crashes or freezes
- [ ] Smooth scrolling
- [ ] Responsive UI

### User Experience:
- [ ] Clear error messages
- [ ] Helpful empty states
- [ ] Intuitive navigation
- [ ] Consistent design
- [ ] Proper feedback for actions

---

## BUGS TO REPORT

If you find any issues, report them with:
1. Screen name
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Device and Android version

---

## TESTING COMPLETE ✅

Once all tests pass, the app is ready for:
- [ ] User acceptance testing
- [ ] Beta release
- [ ] Production deployment

**Tested by:** _______________
**Date:** _______________
**Result:** PASS / FAIL
**Notes:** _______________
