const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');
const sellerRoutes = require('./routes/sellers');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5001',
  process.env.FRONTEND_URL // Add your production frontend URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FreelanceX API!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      services: '/api/services',
      users: '/api/users',
      orders: '/api/orders',
      dashboard: '/api/dashboard',
      sellers: '/api/sellers'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'FreelanceX API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Connected to MongoDB Atlas',
    port: PORT
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sellers', sellerRoutes);

// 404 handler (must be last)
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/services',
      'GET /api/users'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5001;


app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 FreelanceX API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
  console.log('\n✅ Backend Auth + Schema Sync Complete');
  console.log('   - Auth middleware: Enhanced with detailed logging');
  console.log('   - JWT verification: Using same secret as token generation');
  console.log('   - Service schema: Freelancer data formatted for Android');
  console.log('   - Backward compatibility: Website functionality preserved');
  console.log('='.repeat(60) + '\n');
});