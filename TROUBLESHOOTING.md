# 🔧 Troubleshooting Guide

## Common Deployment Issues

### 1. "Connection Refused" Errors

**Symptoms:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:8000/api/posts:1
localhost:8000/api/auth/login:1
```

**Causes & Solutions:**

#### A. React App Still Uses Localhost URLs
- **Problem**: Built React app has hardcoded localhost URLs
- **Solution**: Rebuild the React app after updating the code
```bash
npm run build:client
```

#### B. Environment Variables Not Set Correctly
- **Problem**: `REACT_APP_API_URL` still pointing to localhost
- **Solution**: For single-service deployment, don't set `REACT_APP_API_URL` at all. The app will auto-detect and use relative URLs (`/api`)

#### C. Server Not Running
- **Problem**: Express server not started or crashed
- **Solution**: Check Render logs for server startup errors

### 2. CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest at 'https://api.example.com' from origin 'https://app.example.com' has been blocked by CORS policy
```

**Solution**: 
- For single-service deployment, this shouldn't happen
- If it does, check that both frontend and backend are served from the same domain

### 3. MongoDB Connection Issues

**Symptoms:**
```
MongoDB connection error: MongooseError
```

**Solutions:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Ensure database user has read/write permissions
- Check if IP whitelisting is blocking Render's IPs

### 4. Authentication Issues

**Symptoms:**
- Login fails silently
- JWT errors in console
- User gets logged out immediately

**Solutions:**
- Verify `JWT_SECRET` is set and is the same everywhere
- Check cookie settings for production
- Ensure `withCredentials: true` in API calls

### 5. Image Upload/Display Issues

**Symptoms:**
- Images don't display on home page
- Upload fails
- Broken image links
- "Failed to load image" error messages

**Solutions:**

#### A. Images Not Showing in Production
- **Problem**: `/upload` route conflicts with React routing
- **Solution**: Ensure `/upload` static serving comes BEFORE React's `app.get('*')` route in Express
- **Fix Applied**: Moved upload serving after API routes but before React routing

#### B. Images Not Showing in Development
- **Problem**: Images uploaded to wrong directory or wrong URL generation
- **Development**: Images should be in `client/public/upload/`
- **Production**: Images should be in `api/uploads/`
- **Solution**: Check `getImageUrl()` function is generating correct URLs

#### C. Console Debugging
- Check browser console for image URL generation (in development)
- Look for error messages like "Failed to load image: [URL]"
- Use the new `BlogImage` component which shows loading states

#### D. Upload Directory Issues
- Check if upload directory exists and has write permissions
- **Development**: `client/public/upload/` should exist
- **Production**: `api/uploads/` will be created automatically
- Remember: Render's filesystem is ephemeral (files deleted on restart)

#### E. URL Generation Issues
- In development: URLs should be `http://localhost:8000/upload/filename.jpg`
- In production: URLs should be `/upload/filename.jpg` (relative)
- Check `getImageBaseUrl()` function in `client/src/utils/apiUtils.js`

### 6. Build Failures

**Symptoms:**
```
npm run render-build failed
Module not found
```

**Solutions:**
- Ensure all dependencies are in package.json
- Check for typos in import statements
- Verify all files exist and paths are correct
- Run `npm run build` locally first to test

## Environment Variable Checklist

### Required for Single-Service Deployment:
- ✅ `MONGODB_URI` - MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Strong random string (64+ characters)
- ✅ `NODE_ENV=production` - Sets production mode
- ✅ `REACT_APP_GEMINI_API_KEY` - Google AI API key

### NOT needed (auto-detected):
- ❌ `REACT_APP_API_URL` - Leave this unset for auto-detection
- ❌ `FRONTEND_URL` - Not needed for single-service
- ❌ `PORT` - Render sets this automatically

## Debugging Steps

### 1. Check Render Logs
1. Go to your Render dashboard
2. Click on your service
3. Check "Logs" tab for errors

### 2. Test Locally First
```bash
# Set NODE_ENV to production locally
NODE_ENV=production npm start

# Test if production mode works
curl http://localhost:8000/api/posts
```

### 3. Verify Environment Variables
In Render dashboard:
1. Go to service settings
2. Check "Environment" tab
3. Verify all required variables are set
4. No extra/incorrect variables

### 4. Test API Endpoints
After deployment, test these URLs:
```
https://your-app.onrender.com/api/posts      # Should return posts JSON
https://your-app.onrender.com/               # Should serve React app
https://your-app.onrender.com/login          # Should serve React login page
```

### 5. Check Network Tab
1. Open browser developer tools
2. Go to Network tab
3. Check if API calls are going to correct URLs
4. Look for failed requests

## Common Fixes

### Fix 1: Clean Rebuild
```bash
# Clean everything and rebuild
npm run clean
npm run install:all
npm run build
```

### Fix 2: Reset Environment Variables
In Render dashboard:
1. Remove all environment variables
2. Add only the required ones:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `REACT_APP_GEMINI_API_KEY`

### Fix 3: Check File Structure
Ensure your project structure looks like:
```
├── api/                 # Backend
├── client/              # Frontend
│   └── build/          # Built React app
├── package.json        # Root package.json
└── env.example         # Environment template
```

### Fix 4: Verify Build Commands
In Render service settings:
- **Build Command**: `npm run render-build`
- **Start Command**: `npm start`
- **Root Directory**: (leave empty)

## Need More Help?

1. Check the detailed deployment guide: `RENDER_SINGLE_DEPLOYMENT.md`
2. Review the setup guide: `SETUP_GUIDE.md`
3. Compare your setup with `env.example`
4. Test locally first with the same environment variables

## Contact Support

If issues persist:
1. Check Render's status page
2. Contact Render support with your service logs
3. Provide the exact error messages you're seeing 