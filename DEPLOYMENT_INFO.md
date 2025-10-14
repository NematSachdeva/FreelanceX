# 🚀 FreelanceX Deployment Information

## Production URLs

### Backend API
- **URL**: https://freelancex-backend.vercel.app
- **Health Check**: https://freelancex-backend.vercel.app/api/health
- **Platform**: Vercel

### Frontend
- **URL**: https://freelance-x.vercel.app
- **Platform**: Vercel
- **Repository**: https://github.com/NematSachdeva/FreelanceX
- **Status**: ✅ Live

---

## Backend Environment Variables (Vercel)

```env
MONGO_URI=mongodb+srv://freelancex_user:JaiGauriShankar0001@freelancexcluster.mlz8djx.mongodb.net/freelancex?retryWrites=true&w=majority&appName=FreelanceXCluster

JWT_SECRET=FreelanceX_Secure_JWT_Secret_Key_2024_Production_NematSachdeva

NODE_ENV=production

FRONTEND_URL=https://freelance-x.vercel.app
```

**Note:** Update `FRONTEND_URL` after deploying frontend to Vercel.

---

## Frontend Environment Variables (Vercel)

```env
NEXT_PUBLIC_API_URL=https://freelancex-backend.vercel.app/api
```

---

## Deployment Steps

### ✅ Backend
- Platform: Vercel
- URL: https://freelancex-backend.vercel.app
- Status: ✅ Live

### ✅ Frontend
- Platform: Vercel
- URL: https://freelance-x.vercel.app
- Status: ✅ Live

### 🔄 Final Step: Update Backend CORS

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import repository: `NematSachdeva/FreelanceX`
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://freelancex-backend.onrender.com/api
   ```
7. Click "Deploy"

### 🔄 Update Backend CORS (After Frontend Deployment)

Update backend environment variable on Render:
```env
FRONTEND_URL=https://freelance-x.vercel.app
```

---

## Testing Production

### Test Backend
```bash
# Health check
curl https://freelancex-backend.onrender.com/api/health

# Test registration
curl -X POST https://freelancex-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"client"}'
```

### Test Frontend
After deployment, test:
- User registration
- Login
- Browse services
- Create orders
- View profiles

---

## Database

- **Platform**: MongoDB Atlas
- **Cluster**: FreelanceXCluster
- **Database**: freelancex
- **Status**: Connected

---

## Post-Deployment Checklist

- [x] Backend deployed to Render
- [x] MongoDB Atlas configured
- [x] Backend environment variables set
- [x] Frontend deployed to Vercel
- [x] Frontend environment variables set
- [ ] Backend CORS updated with frontend URL
- [ ] End-to-end testing completed
- [ ] Custom domain configured (optional)

---

## Support

- **GitHub**: https://github.com/NematSachdeva/FreelanceX
- **Backend Health**: https://freelancex-backend.onrender.com/api/health

---

**Last Updated**: October 14, 2025
