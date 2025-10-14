# 🚀 FreelanceX Deployment Guide

Complete guide to deploy FreelanceX to production.

## 📋 Pre-Deployment Checklist

### Backend Preparation
- [ ] MongoDB Atlas database created and configured
- [ ] Environment variables configured for production
- [ ] CORS origins updated for production domain
- [ ] API endpoints tested
- [ ] Security headers configured

### Frontend Preparation
- [ ] API URL updated for production
- [ ] Build tested locally
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Analytics configured

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for testing)

### 2. Configure Database Access
```bash
# Create database user
Username: freelancex_admin
Password: [Generate secure password]
Role: Atlas Admin
```

### 3. Configure Network Access
```bash
# Allow access from anywhere (for deployment)
IP Address: 0.0.0.0/0
```

### 4. Get Connection String
```
mongodb+srv://freelancex_admin:<password>@cluster0.xxxxx.mongodb.net/freelancex?retryWrites=true&w=majority
```

---

## 🔧 Backend Deployment (Railway/Render)

### Option 1: Deploy to Railway

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login and Initialize
```bash
railway login
cd backend
railway init
```

#### 3. Set Environment Variables
```bash
railway variables set MONGODB_URI="your_mongodb_connection_string"
railway variables set JWT_SECRET="your_secure_jwt_secret"
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL="https://your-frontend-domain.vercel.app"
```

#### 4. Deploy
```bash
railway up
```

#### 5. Get Backend URL
```bash
railway domain
# Example: https://freelancex-backend.up.railway.app
```

### Option 2: Deploy to Render

#### 1. Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `backend` directory

#### 2. Configure Service
```yaml
Name: freelancex-backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

#### 3. Add Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 4. Deploy
Click "Create Web Service"

---

## 🎨 Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy Frontend
```bash
cd frontend
vercel
```

### 3. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### 4. Deploy to Production
```bash
vercel --prod
```

### 5. Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 🔒 Security Configuration

### Backend Security Headers (Helmet.js)

Update `backend/server.js`:

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### CORS Configuration

Update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-domain.vercel.app',
    'https://www.your-custom-domain.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Rate Limiting

```bash
cd backend
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Analytics Setup

### Google Analytics

1. Create GA4 property at [Google Analytics](https://analytics.google.com/)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `frontend/app/layout.tsx`:

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Vercel Analytics

Already included! Just ensure it's in your layout:

```typescript
import { Analytics } from "@vercel/analytics/next"

// In your layout
<Analytics />
```

---

## 🔍 SEO Optimization

### Update Meta Tags

Update `frontend/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "FreelanceX - Find Top Freelancers",
  description: "Connect with talented freelancers for your next project. Browse services, hire experts, and get work done.",
  keywords: "freelance, freelancers, hire, services, gigs, remote work",
  authors: [{ name: "FreelanceX" }],
  openGraph: {
    title: "FreelanceX - Find Top Freelancers",
    description: "Connect with talented freelancers for your next project",
    url: "https://your-domain.com",
    siteName: "FreelanceX",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceX - Find Top Freelancers",
    description: "Connect with talented freelancers for your next project",
    images: ["https://your-domain.com/og-image.jpg"],
  },
};
```

### Add robots.txt

Create `frontend/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /orders/

Sitemap: https://your-domain.com/sitemap.xml
```

---

## 🧪 Testing Production Build

### Test Backend Locally
```bash
cd backend
NODE_ENV=production npm start
```

### Test Frontend Build
```bash
cd frontend
npm run build
npm start
```

### Test Full Integration
1. Start backend in production mode
2. Start frontend build
3. Test all features:
   - User registration/login
   - Service browsing
   - Order creation
   - Profile viewing
   - Reviews

---

## 📈 Monitoring & Maintenance

### Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com/) (Free):
1. Create account
2. Add monitors for:
   - Backend API: `https://your-backend-url.railway.app/api/health`
   - Frontend: `https://your-frontend-domain.vercel.app`

### Error Tracking

Use [Sentry](https://sentry.io/) (Free tier available):

```bash
cd frontend
npm install @sentry/nextjs
```

```typescript
// frontend/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
});
```

### Database Backups

MongoDB Atlas automatically backs up your data. Configure:
1. Go to Atlas Dashboard → Backup
2. Enable Continuous Backup
3. Set retention period

---

## 🎯 Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend is deployed and loading
- [ ] Database connection is working
- [ ] User registration works
- [ ] Login/logout works
- [ ] Service browsing works
- [ ] Order creation works
- [ ] Reviews work
- [ ] All images load correctly
- [ ] Mobile responsiveness verified
- [ ] SSL certificate is active
- [ ] Analytics tracking works
- [ ] Error monitoring is active
- [ ] Uptime monitoring configured

---

## 🆘 Troubleshooting

### Backend Issues

**Problem**: Cannot connect to MongoDB
```bash
# Check connection string format
# Ensure IP whitelist includes 0.0.0.0/0
# Verify database user credentials
```

**Problem**: CORS errors
```bash
# Update CORS origins in backend
# Ensure FRONTEND_URL is set correctly
```

### Frontend Issues

**Problem**: API calls failing
```bash
# Verify NEXT_PUBLIC_API_URL is correct
# Check backend is accessible
# Verify CORS configuration
```

**Problem**: Build fails
```bash
# Clear cache: rm -rf .next
# Reinstall: rm -rf node_modules && npm install
# Check for TypeScript errors
```

---

## 📞 Support

For deployment issues:
1. Check logs in Railway/Render/Vercel dashboard
2. Verify all environment variables
3. Test API endpoints with Postman
4. Check browser console for errors

---

## 🎉 Success!

Your FreelanceX marketplace is now live! 🚀

Next steps:
- Share with users
- Gather feedback
- Monitor performance
- Add new features
- Scale as needed

**Production URLs:**
- Frontend: https://your-domain.vercel.app
- Backend: https://your-backend.railway.app
- Database: MongoDB Atlas

Congratulations on launching your marketplace! 🎊
