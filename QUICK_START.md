# FreelanceX Quick Start Guide

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5001

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### 3. Initialize Database (First Time Only)
```bash
cd backend
npm run init-db
```

## ✅ Test the Application

### 1. Register a New User
- Go to: http://localhost:3000/auth/join
- Fill in the form
- Select role: Client or Freelancer
- Click "Create Account"

### 2. Login
- Go to: http://localhost:3000/auth/signin
- Use sample credentials:
  - Email: john@example.com
  - Password: password123

### 3. View Profile
- After login, click on your avatar in the top right
- Select "My Profile"
- Click "Edit Profile" to update your information

### 4. View Dashboard
- Click on your avatar → "Dashboard"
- See your stats and recent activity

### 5. Update Profile
- Go to Profile page
- Click "Edit Profile"
- Update:
  - Name, Bio, Location
  - Skills (type and press Enter)
  - Social Links (GitHub, LinkedIn, Portfolio)
  - Hourly Rate (for freelancers)
- Click "Save"

## 📊 Features to Test

### For Freelancers:
1. **Dashboard**: View total services, orders, earnings
2. **Profile**: Add skills, bio, social links
3. **Services**: Create and manage services
4. **Orders**: View and manage incoming orders

### For Clients:
1. **Dashboard**: View total orders, active orders, spending
2. **Profile**: Update personal information
3. **Browse Services**: Find freelancers
4. **Place Orders**: Hire freelancers

## 🔍 API Endpoints

### Authentication
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login

### Profile
- GET `/api/users/profile/me` - Get current user
- PUT `/api/users/profile` - Update profile
- GET `/api/users/profile/:id` - Get user by ID

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics
- GET `/api/dashboard/activity` - Get activity timeline
- GET `/api/dashboard/earnings` - Get earnings chart

### Services
- GET `/api/services` - List all services
- POST `/api/services` - Create service
- PUT `/api/services/:id` - Update service
- DELETE `/api/services/:id` - Delete service

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- PUT `/api/orders/:id/status` - Update order status

## 🎯 Sample Data

After running `npm run init-db`, you'll have:

### Users:
- **Freelancer**: john@example.com / password123
- **Designer**: sarah@example.com / password123
- **Marketer**: mike@example.com / password123
- **Client**: emily@example.com / password123

### Services:
- 6 sample services across different categories
- With images, prices, and descriptions

### Orders:
- 3 sample orders with different statuses
- Messages between buyers and sellers

## 🛠️ Troubleshooting

### Backend not starting?
- Check MongoDB connection in `.env`
- Ensure port 5001 is not in use
- Run: `npm run test-db` to test connection

### Frontend not loading?
- Check `.env.local` has correct API URL
- Clear browser cache
- Check console for errors

### Profile not updating?
- Check JWT token in localStorage
- Verify backend is running
- Check Network tab for API errors

### Dashboard not showing data?
- Login first
- Check if sample data is loaded
- Verify API endpoints are working

## 📱 Mobile Testing

The application is fully responsive. Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🎨 UI Components

### Navigation
- Authenticated: Shows avatar dropdown
- Unauthenticated: Shows Sign In / Join buttons

### Profile Page
- View mode: Display all information
- Edit mode: Update all fields
- Skills: Add/remove with Enter key
- Social links: GitHub, LinkedIn, Portfolio

### Dashboard
- Freelancer view: Services, Orders, Earnings
- Client view: Orders, Spending, Activity
- Recent activity timeline
- Stats cards with icons

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration

## 📈 Next Steps

1. Add file upload for avatars
2. Implement real-time messaging
3. Add payment integration
4. Create admin panel
5. Add email notifications
6. Implement search functionality
7. Add service reviews
8. Create order tracking

Enjoy building with FreelanceX! 🎉