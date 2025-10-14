# FreelanceX Quick Commands Reference

## 🚀 Getting Started

### First Time Setup
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Setup environment variables
cd ../backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Seed the database with sample data
npm run seed-data

# 5. Start backend (Terminal 1)
npm run dev

# 6. Start frontend (Terminal 2)
cd ../frontend
npm run dev
```

### Visit Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- Health Check: http://localhost:5001/api/health

---

## 📦 Backend Commands

```bash
cd backend

# Development
npm run dev              # Start with nodemon (auto-reload)
npm start               # Start production server

# Database
npm run seed-data       # Seed with 10 freelancers + services
npm run init-db         # Initialize with basic data
npm run test-db         # Test MongoDB connection

# Testing
npm run test-routes     # Test all API endpoints
```

---

## 💻 Frontend Commands

```bash
cd frontend

# Development
npm run dev             # Start development server
npm run build           # Build for production
npm start              # Start production server
npm run lint           # Run ESLint
```

---

## 🧪 Testing Commands

### Test Backend Health
```bash
curl http://localhost:5001/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@freelancex.com","password":"password123"}'
```

### Test Services
```bash
curl http://localhost:5001/api/services
```

### Test User Profile
```bash
curl http://localhost:5001/api/users/profile/USER_ID
```

---

## 🔐 Sample Login Credentials

### Freelancers
```
alex@freelancex.com / password123 (Full-Stack Developer)
sarah@freelancex.com / password123 (UI/UX Designer)
michael@freelancex.com / password123 (SEO Specialist)
emma@freelancex.com / password123 (Graphic Designer)
david@freelancex.com / password123 (Mobile Developer)
```

### Clients
```
john@client.com / password123
emily@client.com / password123
```

---

## 🗄️ Database Commands

### Seed Fresh Data
```bash
cd backend
npm run seed-data
```

### Check MongoDB Connection
```bash
cd backend
npm run test-db
```

### View Data in MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select your database
4. View users, services, orders collections

---

## 🐛 Troubleshooting Commands

### Kill Port 5001 (if backend won't start)
```bash
# macOS/Linux
lsof -ti:5001 | xargs kill -9

# Or use npx
npx kill-port 5001
```

### Kill Port 3000 (if frontend won't start)
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use npx
npx kill-port 3000
```

### Clear Node Modules and Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

### Check for Errors
```bash
# Backend logs
cd backend
npm run dev
# Watch console for errors

# Frontend logs
cd frontend
npm run dev
# Watch console and browser console
```

---

## 📊 Useful API Endpoints

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
```

### Users
```bash
GET /api/users                    # Get all freelancers
GET /api/users/profile/:id        # Get user profile
GET /api/users/profile/me         # Get current user
PUT /api/users/profile            # Update profile
```

### Services
```bash
GET /api/services                 # Get all services
GET /api/services/:id             # Get single service
POST /api/services                # Create service
PUT /api/services/:id             # Update service
DELETE /api/services/:id          # Delete service
```

### Orders
```bash
POST /api/orders                  # Create order
GET /api/orders                   # Get user orders
GET /api/orders/client/:id        # Get client orders
GET /api/orders/freelancer/:id    # Get freelancer orders
PUT /api/orders/:id/complete      # Complete order
POST /api/orders/:id/review       # Add review
```

### Dashboard
```bash
GET /api/dashboard/stats          # Get dashboard stats
GET /api/dashboard/activity       # Get activity timeline
GET /api/dashboard/earnings       # Get earnings data
```

---

## 🔄 Common Workflows

### Add New Freelancer
1. Go to http://localhost:3000/auth/join
2. Fill in details, select "Freelancer"
3. Login and complete profile
4. Add services

### Create Order
1. Login as client
2. Browse services at /explore
3. Click "Order Now"
4. Fill requirements
5. Submit order

### Complete Order & Review
1. Login as freelancer
2. Go to orders page
3. Click "Complete Order"
4. Client can now leave review

### Update Profile
1. Login
2. Click avatar → "My Profile"
3. Click "Edit Profile"
4. Update fields
5. Save changes

---

## 📝 Development Workflow

### Making Changes

**Backend Changes:**
```bash
cd backend
# Edit files in models/, controllers/, routes/
# Server auto-reloads with nodemon
```

**Frontend Changes:**
```bash
cd frontend
# Edit files in app/, components/, lib/
# Browser auto-reloads with Next.js
```

### Testing Changes
1. Make changes
2. Check console for errors
3. Test in browser
4. Verify in MongoDB Atlas

---

## 🚀 Deployment Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Test Production Build
```bash
cd frontend
npm run build
npm start
```

### Deploy to Vercel
```bash
cd frontend
vercel
```

### Deploy Backend
```bash
cd backend
# Follow deployment guide in DEPLOYMENT_CHECKLIST.md
```

---

## 💡 Pro Tips

### Quick Reset
```bash
# Reset database with fresh seed data
cd backend
npm run seed-data
```

### View Logs
```bash
# Backend logs
cd backend
npm run dev | tee backend.log

# Frontend logs
cd frontend
npm run dev | tee frontend.log
```

### Check All Services Running
```bash
# Check backend
curl http://localhost:5001/api/health

# Check frontend
curl http://localhost:3000
```

---

## 🆘 Emergency Commands

### Complete Reset
```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear everything
cd backend
rm -rf node_modules
cd ../frontend
rm -rf node_modules .next

# 3. Reinstall
cd ../backend
npm install
cd ../frontend
npm install

# 4. Reseed database
cd ../backend
npm run seed-data

# 5. Restart servers
cd backend
npm run dev
# New terminal
cd frontend
npm run dev
```

---

**Quick Reference Card**
```
Start Backend:    cd backend && npm run dev
Start Frontend:   cd frontend && npm run dev
Seed Database:    cd backend && npm run seed-data
Test API:         curl http://localhost:5001/api/health
View App:         http://localhost:3000
```

Save this file for quick reference! 📌