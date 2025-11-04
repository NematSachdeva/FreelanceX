# Quick Test Guide

## 🚀 Quick Start

### 1. Restart Backend (Terminal 1)
```bash
cd freelancer-marketplace/backend
npm start
```

### 2. Run Test Script (Terminal 2)
```bash
cd freelancer-marketplace/backend
node test-order-auth.js
```

### 3. Test from Mobile App
1. Login to the app
2. Browse to any service
3. Click "Order Now"
4. Fill requirements
5. Submit order
6. **Watch Terminal 1** for detailed logs

## 📋 What You'll See

### ✅ Success Logs:
```
=== AUTH MIDDLEWARE DEBUG ===
✅ Token decoded successfully
✅ Auth successful, user attached to request

=== CREATE ORDER DEBUG ===
✅ Using buyer ID from authenticated user
✅ Order created successfully
```

### ❌ Error Logs:
```
❌ No token provided
❌ User not found in database
❌ Auth middleware error
❌ Validation errors
```

## 🔍 Quick Checks

If order creation fails:

1. **Check token is sent:**
   - Look for "Authorization header: Bearer ..."
   - Should NOT be "undefined" or "null"

2. **Check token is valid:**
   - Look for "✅ Token decoded successfully"
   - Should show userId

3. **Check user exists:**
   - Look for "User found: [id] - [email]"
   - Should NOT be "NO USER"

4. **Check validation:**
   - Look for "❌ Validation errors"
   - Fix any missing/invalid fields

## 📞 Need Help?

Share these logs from your terminal:
1. The entire "=== AUTH MIDDLEWARE DEBUG ===" section
2. The entire "=== CREATE ORDER DEBUG ===" section
3. Any error messages

This will help diagnose the exact issue!
