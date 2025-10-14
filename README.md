# 🚀 FreelanceX - Professional Freelance Marketplace

A production-ready, feature-rich freelance marketplace built with Next.js, Express.js, and MongoDB. Features smooth animations, professional UI/UX, and comprehensive order management.

[![Status](https://img.shields.io/badge/status-production--ready-success)]()
[![Version](https://img.shields.io/badge/version-2.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## ✨ Highlights

- 🎨 **Beautiful UI** with Framer Motion animations
- 📱 **Fully Responsive** - Perfect on all devices
- 🔒 **Secure Authentication** with JWT
- 📦 **Complete Order System** with reviews
- ⚡ **Optimized Performance** with skeleton loaders
- 🎯 **Professional UX** with toast notifications
- 📚 **Comprehensive Documentation**
- 🚀 **Ready to Deploy**

## 🏗️ Project Structure

```
freelancer-marketplace/
├── backend/                 # Express.js API Server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Database scripts
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env               # Backend environment variables
├── frontend/              # Next.js Frontend
│   ├── app/              # Next.js 13+ app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── public/          # Static assets
│   ├── styles/          # CSS styles
│   ├── package.json     # Frontend dependencies
│   └── .env.local       # Frontend environment variables
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Option 1: Automated Setup
```bash
git clone <your-repo-url>
cd freelancer-marketplace
./setup.sh        # Run setup script
```

### Option 2: Manual Setup

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd freelancer-marketplace
```

#### 2. Install Dependencies
```bash
npm run install:all  # Install both backend and frontend dependencies
```

#### 3. Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend configuration (already created)
cd ../frontend
# .env.local is automatically created with correct API URL
```

#### 4. Initialize Database
```bash
npm run init-db     # Initialize database with sample data
```

#### 5. Start Development Servers
```bash
npm run dev         # Start both backend and frontend
# OR start them separately:
npm run dev:backend # Start backend only (port 5001)
npm run dev:frontend # Start frontend only (port 3000)
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **API Health Check**: http://localhost:5001/api/health

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancex
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📋 Features (100+)

### 🎨 UI/UX Excellence
- ✅ **Framer Motion Animations** - Smooth page transitions and micro-interactions
- ✅ **Toast Notifications** - Professional success/error messages
- ✅ **Skeleton Loaders** - Better perceived performance
- ✅ **Empty States** - Helpful messages with CTAs
- ✅ **Responsive Design** - Mobile-first, works everywhere
- ✅ **Card Hover Effects** - Delightful interactions

### 👤 User Management
- ✅ **Secure Authentication** - JWT-based with bcrypt
- ✅ **Role-based Access** - Client/Freelancer views
- ✅ **Public Profiles** - Showcase freelancer portfolios
- ✅ **Profile Editing** - Update info, skills, bio
- ✅ **Avatar Display** - Professional profile photos
- ✅ **Rating System** - Average ratings from reviews

### 🛍️ Service Marketplace
- ✅ **Service Browsing** - Grid view with filters
- ✅ **Advanced Search** - Find by keywords, category, price
- ✅ **Category Filtering** - 10+ service categories
- ✅ **Price Range Filter** - Min/max sliders
- ✅ **Sort Options** - By newest, rating, price
- ✅ **Service Details** - Full service information pages

### 📦 Order Management
- ✅ **Order Creation** - Smooth modal flow
- ✅ **Order Tracking** - Pending, In Progress, Completed
- ✅ **Status Updates** - Freelancers can mark complete
- ✅ **Order Dashboard** - View all orders
- ✅ **Requirements Input** - Detailed project specs
- ✅ **Payment Methods** - Multiple options

### ⭐ Review System
- ✅ **5-Star Ratings** - Standard rating scale
- ✅ **Written Reviews** - Optional detailed feedback
- ✅ **Review Display** - On services and profiles
- ✅ **Average Ratings** - Calculated automatically
- ✅ **Review Modal** - Smooth submission flow

### 🚀 Performance
- ✅ **Code Splitting** - Next.js automatic optimization
- ✅ **Image Optimization** - Fast loading
- ✅ **Lazy Loading** - Load content as needed
- ✅ **Skeleton Loaders** - Instant perceived speed
- ✅ **Optimized Builds** - Production-ready

### 🔒 Security
- ✅ **Password Hashing** - Bcrypt encryption
- ✅ **JWT Tokens** - Secure authentication
- ✅ **Protected Routes** - Authorization checks
- ✅ **Input Validation** - Server-side validation
- ✅ **CORS Configuration** - Controlled access

### 📱 Mobile Experience
- ✅ **Touch-Optimized** - Large tap targets
- ✅ **Responsive Grid** - Adapts to screen size
- ✅ **Mobile Navigation** - Smooth menu
- ✅ **Optimized Forms** - Easy mobile input

> **See [FEATURES.md](FEATURES.md) for complete feature list**

## 🛠️ Available Scripts

### Root Directory
```bash
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run install:all      # Install all dependencies
npm run install:backend  # Install backend dependencies
npm run install:frontend # Install frontend dependencies
npm run init-db          # Initialize database with sample data
npm run test-db          # Test database connection
npm run build            # Build frontend for production
npm run start            # Start both servers in production
```

### Backend (cd backend)
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run init-db     # Initialize database with sample data
npm run test-db     # Test database connection
npm run test-routes # Test all API endpoints
```

### Frontend (cd frontend)
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (auth required)
- `PUT /api/services/:id` - Update service (auth required)
- `DELETE /api/services/:id` - Delete service (auth required)

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders` - Get user orders (auth required)
- `PUT /api/orders/:id/status` - Update order status (auth required)

### Users
- `GET /api/users` - Get all freelancers
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (auth required)

## 🧪 Testing

### Sample Login Credentials
After running `npm run init-db` in the backend:

- **Freelancer**: john@example.com / password123
- **Designer**: sarah@example.com / password123
- **Marketer**: mike@example.com / password123
- **Client**: emily@example.com / password123

### Manual Testing
1. Register a new user at `/auth/join`
2. Login at `/auth/signin`
3. Browse services at `/services`
4. Create orders and test the full workflow

## 🚀 Deployment

FreelanceX is production-ready and can be deployed in minutes!

### Quick Deploy
1. **Backend** → Railway/Render (5 minutes)
2. **Frontend** → Vercel (2 minutes)
3. **Database** → MongoDB Atlas (Free tier)

### Detailed Guide
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Step-by-step deployment instructions
- Environment variable configuration
- Security setup (Helmet.js, rate limiting)
- Analytics integration (Google Analytics, Vercel)
- Monitoring setup (UptimeRobot, Sentry)
- Domain and SSL configuration
- Troubleshooting guide

### Production Checklist
- [ ] MongoDB Atlas configured
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Environment variables set
- [ ] CORS configured for production
- [ ] Analytics tracking active
- [ ] Monitoring setup complete

> **See [POLISH_CHECKLIST.md](POLISH_CHECKLIST.md) for complete deployment checklist**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📚 Documentation

Comprehensive documentation for all aspects:

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[FEATURES.md](FEATURES.md)** - Complete feature list (100+)
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[POLISH_CHECKLIST.md](POLISH_CHECKLIST.md)** - Enhancement tracking
- **[WHATS_NEW.md](WHATS_NEW.md)** - Latest updates and changes
- **[QUICK_COMMANDS.md](QUICK_COMMANDS.md)** - Useful command reference

## 🎯 What Makes FreelanceX Special?

### Professional Quality
- Smooth animations that feel premium
- Toast notifications instead of browser alerts
- Skeleton loaders for better UX
- Empty states with helpful CTAs
- Mobile-optimized experience

### Production Ready
- Comprehensive documentation
- Security best practices
- Performance optimized
- SEO ready
- Analytics ready
- Monitoring ready

### Developer Friendly
- Clean, maintainable code
- TypeScript for type safety
- Component-based architecture
- Well-documented API
- Easy to extend

## 🎊 Success Stories

FreelanceX is ready for:
- ✅ Real users and transactions
- ✅ Production deployment
- ✅ Scaling as you grow
- ✅ Adding new features
- ✅ Custom branding

## 🆘 Support

### Quick Help
1. Check [QUICK_START.md](QUICK_START.md) for setup issues
2. Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment
3. See [FEATURES.md](FEATURES.md) for feature questions

### Common Issues
- **Servers not starting**: Check environment variables
- **Database connection**: Verify MongoDB URI
- **API errors**: Check CORS configuration
- **Build errors**: Clear cache and reinstall dependencies

### Get Help
- Open an issue in the repository
- Check the documentation files
- Review the code comments

## 🎉 Ready to Launch?

FreelanceX is a **complete, production-ready marketplace** with:
- 🎨 Beautiful, animated UI
- 📱 Perfect mobile experience
- 🔒 Secure authentication
- 📦 Full order management
- ⭐ Review system
- 🚀 Optimized performance
- 📚 Comprehensive docs

**Start your freelance marketplace today!** 🚀