# Backend Authentication Fix Guide

## Problem
Order creation returns "Invalid user session" even though:
- Login works and returns token ✅
- Token is stored in Android app ✅
- AuthInterceptor adds `Authorization: Bearer <token>` ✅
- Other API calls work ✅

**Root Cause:** The order creation endpoint is missing authentication middleware or not validating the JWT token correctly.

## Fix in Backend (NOT in freelancex-app folder)

### Step 1: Locate Backend Files

Navigate to your backend folder:
```bash
cd freelancer-marketplace/backend
# or wherever your backend code is located
```

### Step 2: Check Order Routes

Open `routes/orderRoutes.js` (or similar) and verify:

**BEFORE (Missing auth):**
```javascript
router.post('/api/orders', createOrder);
```

**AFTER (With auth):**
```javascript
const authMiddleware = require('../middleware/authMiddleware');

router.post('/api/orders', authMiddleware, createOrder);
```

### Step 3: Verify Auth Middleware

Open `middleware/authMiddleware.js` (or `authentication.js`):

**Correct Implementation:**
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No token provided' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err.message);
                return res.status(401).json({ 
                    message: 'Invalid user session, please login again' 
                });
            }
            
            // Attach user info to request
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            message: 'Authentication failed' 
        });
    }
};

module.exports = authMiddleware;
```

### Step 4: Update Order Controller

Open `controllers/orderController.js`:

**BEFORE (Trusting client data):**
```javascript
const createOrder = async (req, res) => {
    const { serviceId, clientId, freelancerId, requirements } = req.body;
    
    // This is INSECURE - clientId from body can be faked
    const order = new Order({
        serviceId,
        clientId,  // ❌ Don't trust this
        freelancerId,
        requirements
    });
    
    await order.save();
    res.json(order);
};
```

**AFTER (Using authenticated user):**
```javascript
const createOrder = async (req, res) => {
    try {
        const { serviceId, freelancerId, requirements } = req.body;
        
        // Use authenticated user ID from JWT token
        const clientId = req.user.id || req.user._id;  // ✅ From JWT
        
        // Validate required fields
        if (!serviceId || !freelancerId || !requirements) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
        }
        
        // Create order
        const order = new Order({
            serviceId,
            clientId,      // ✅ From authenticated user
            freelancerId,
            requirements,
            status: 'pending'
        });
        
        await order.save();
        
        // Populate related data before sending response
        await order.populate('serviceId freelancerId clientId');
        
        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ 
            message: 'Failed to create order',
            error: error.message 
        });
    }
};
```

### Step 5: Verify JWT Secret Consistency

Check `.env` file:
```env
JWT_SECRET=your_secret_key_here
```

**IMPORTANT:** The same `JWT_SECRET` must be used for:
1. Signing tokens during login (in `authController.js`)
2. Verifying tokens in middleware (in `authMiddleware.js`)

**Login Controller (authController.js):**
```javascript
const login = async (req, res) => {
    // ... validate user ...
    
    // Sign token with JWT_SECRET
    const token = jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role 
        },
        process.env.JWT_SECRET,  // ✅ Same secret
        { expiresIn: '7d' }
    );
    
    res.json({ token, user });
};
```

### Step 6: Test the Fix

**Test 1: Check if middleware is applied**
```bash
# Try creating order without token
curl -X POST https://your-backend.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"123","freelancerId":"456","requirements":"test"}'

# Should return: 401 "No token provided"
```

**Test 2: Check with valid token**
```bash
# First login to get token
curl -X POST https://your-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token to create order
curl -X POST https://your-backend.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"serviceId":"123","freelancerId":"456","requirements":"test"}'

# Should return: 201 with order data
```

### Step 7: Restart Backend

After making changes:
```bash
# If using nodemon (auto-restart)
# Just save the files

# If using node directly
# Stop the server (Ctrl+C) and restart:
npm start

# Or if using PM2
pm2 restart all
```

## Common Issues & Solutions

### Issue 1: "No token provided"
**Cause:** Token not in Authorization header  
**Fix:** Android app already sends it correctly via AuthInterceptor

### Issue 2: "Invalid user session"
**Cause:** JWT_SECRET mismatch or token expired  
**Fix:** 
- Verify same JWT_SECRET in login and middleware
- Check token expiration (increase to 7d if needed)
- Have user logout and login again

### Issue 3: "Cannot read property 'id' of undefined"
**Cause:** req.user not set by middleware  
**Fix:** Ensure middleware calls `req.user = decoded` before `next()`

### Issue 4: Order created but clientId is null
**Cause:** Using wrong property name from decoded token  
**Fix:** Check if token has `id`, `_id`, or `userId`

## Verification Checklist

After fixing, verify:

- [ ] Order route has authMiddleware: `router.post('/api/orders', authMiddleware, createOrder)`
- [ ] Middleware extracts token: `req.headers.authorization?.split(' ')[1]`
- [ ] Middleware verifies with JWT_SECRET: `jwt.verify(token, process.env.JWT_SECRET, ...)`
- [ ] Middleware sets req.user: `req.user = decoded`
- [ ] Controller uses req.user.id: `const clientId = req.user.id`
- [ ] Same JWT_SECRET in login and middleware
- [ ] Backend restarted after changes

## Android App is Ready

The Android app already:
- ✅ Sends `Authorization: Bearer <token>` automatically
- ✅ Stores token securely
- ✅ Includes token in all API requests
- ✅ Handles 401 errors

No changes needed in the Android app. Just fix the backend!

## After Backend Fix

Test in the Android app:
1. Logout and login again (to get fresh token)
2. Browse services
3. Click "Order Now"
4. Fill requirements
5. Click "Confirm Order"
6. Should succeed and show in Orders screen

## Need Help?

If still not working, check backend logs for:
```
console.log('Token received:', token);
console.log('Decoded user:', decoded);
console.log('Creating order for client:', clientId);
```

This will show exactly what the backend is receiving and processing.
