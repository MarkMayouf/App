# 🚀 Render Single-Service Deployment Guide

Deploy your full-stack blog application as a **single web service** on Render, where the Express server serves both the API and the React frontend.

## 📋 Required Environment Variables

Set these in your Render dashboard for your **single web service**:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random

# Environment Mode
NODE_ENV=production

# API URL for React App (use relative path for single service)
REACT_APP_API_URL=/api

# Google Gemini AI API Key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

## 🛠️ Render Service Configuration

### 1. Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### 2. Service Settings
Configure your service with these exact settings:

| Setting | Value |
|---------|-------|
| **Name** | `blog-app-full` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | Leave empty (uses repository root) |
| **Build Command** | `npm run render-build` |
| **Start Command** | `npm start` |

### 3. Environment Variables
Add the following environment variables in the Render dashboard:

```bash
MONGODB_URI = mongodb+srv://your-username:your-password@your-cluster.mongodb.net/blog
JWT_SECRET = your-super-secret-jwt-key-123456789
NODE_ENV = production
REACT_APP_API_URL = /api
REACT_APP_GEMINI_API_KEY = your_gemini_api_key
```

## 🗄️ MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Use the free tier for testing
3. **Create Database User**: 
   - Username: Choose a username
   - Password: Generate a strong password
4. **Network Access**: Add `0.0.0.0/0` to allow access from anywhere
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `blog`

## 🤖 Google Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for `REACT_APP_GEMINI_API_KEY`

## 🔧 How It Works

In production, your Express server will:
1. **Serve API routes** at `/api/*` (auth, posts, upload)
2. **Serve React build files** for all other routes
3. **Handle React routing** by sending `index.html` for unknown routes
4. **Upload files** to the server's uploads directory

## 🌐 Accessing Your Application

After deployment, your application will be available at:
```
https://your-service-name.onrender.com
```

**API endpoints:**
- `GET /` - Serves React app homepage
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Get all posts
- `POST /api/upload` - File upload

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Google Gemini API key obtained
- [ ] Repository pushed to GitHub
- [ ] Render web service created with correct settings
- [ ] All environment variables added to Render
- [ ] Service deployed successfully
- [ ] Application accessible at Render URL
- [ ] API endpoints working
- [ ] File uploads working
- [ ] Authentication working
- [ ] AI writing assistant working

## 🔍 Troubleshooting

### Build Issues
- **"npm run render-build failed"**: Check build logs for specific errors
- **"Module not found"**: Ensure all dependencies are in package.json
- **Build timeout**: Optimize build process or contact Render support

### Runtime Issues
- **"Application failed to start"**: Check environment variables are set correctly
- **"MongoDB connection failed"**: Verify connection string and network access
- **"CORS errors"**: Should not occur with single-service deployment
- **"Authentication not working"**: Check JWT_SECRET is set

### File Upload Issues
- **"File upload failed"**: Render's file system is ephemeral; consider external storage for production

## 🚀 Performance Tips

1. **Optimize React build**: Ensure build creates optimized production files
2. **MongoDB indexing**: Create indexes for frequently queried fields
3. **Image optimization**: Consider image compression for uploads
4. **Caching**: Implement appropriate caching headers

## 🔒 Security Considerations

- **JWT Secret**: Use a long, random string (64+ characters)
- **MongoDB**: Use strong passwords and IP whitelisting
- **API Keys**: Keep Gemini API key secure
- **HTTPS**: Render provides SSL/TLS automatically
- **Environment Variables**: Never commit secrets to version control

## 📱 Testing Your Deployment

1. **Homepage**: Visit your Render URL
2. **Registration**: Create a test account
3. **Login**: Test authentication
4. **Create Post**: Test post creation and image upload
5. **AI Assistant**: Test the writing assistant feature
6. **Navigation**: Test all React routes work correctly

Your full-stack blog application is now deployed as a single service on Render! 🎉 