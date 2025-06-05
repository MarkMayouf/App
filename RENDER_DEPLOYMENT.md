# Render Deployment Guide - MongoDB Blog Application

## Required Environment Variables

For deploying your blog application on Render with MongoDB, you need to configure the following environment variables in your Render dashboard:

### 🔑 Essential Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### 📝 Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/blog` |
| `JWT_SECRET` | Secret key for JWT authentication | `my-super-secret-jwt-key-12345` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.onrender.com` |
| `PORT` | Server port (auto-set by Render) | `8000` |

## 🚀 Step-by-Step Deployment

### 1. MongoDB Atlas Setup
1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster (free tier is fine for testing)
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" → "Connect your application"
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `blog` or your preferred database name

### 2. Render Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `your-blog-api`
   - **Environment**: `Node`
   - **Build Command**: `cd api && npm install`
   - **Start Command**: `cd api && npm start`

### 3. Environment Variables Configuration
In your Render service settings, add these environment variables:

```bash
# MongoDB Connection
MONGODB_URI = mongodb+srv://your-username:your-password@your-cluster.mongodb.net/blog

# JWT Secret (generate a strong random string)
JWT_SECRET = your-super-secret-jwt-key-make-it-long-and-random-123456789

# Environment
NODE_ENV = production

# Frontend URL (update after frontend deployment)
FRONTEND_URL = https://your-frontend-app.onrender.com
```

### 4. Generate JWT Secret
You can generate a secure JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Deploy Frontend
1. Deploy your React frontend to Render
2. Update the `FRONTEND_URL` environment variable with the actual frontend URL
3. Update your frontend's API base URL to point to your backend service

## 🔧 Current Application Configuration

Your application is already configured to use these environment variables:

- **Database**: Uses `MONGODB_URI` or falls back to `DB_HOST`, `DB_PORT`, `DB_NAME`
- **Authentication**: Uses `JWT_SECRET` for token signing
- **CORS**: Configured for production with `FRONTEND_URL`
- **File Uploads**: Configured for production environment
- **Port**: Uses `PORT` environment variable (auto-set by Render)

## 🛠️ Build Configuration

Your `package.json` is already configured correctly:
- Uses `"start": "node index.js"` for production
- Has `"engines": {"node": ">=18.0.0"}` specified
- Uses ES modules (`"type": "module"`)

## 🔍 Troubleshooting

### Common Issues:
1. **MongoDB Connection**: Ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for all IPs)
2. **CORS Errors**: Make sure `FRONTEND_URL` matches your exact frontend URL
3. **Authentication Issues**: Verify `JWT_SECRET` is set and consistent
4. **File Uploads**: Check if upload directory permissions are correct

### Environment Variables Not Loading:
- Ensure all variables are added in Render dashboard
- Check for typos in variable names
- Restart your service after adding variables

## ✅ Verification

After deployment, your API should be accessible at:
```
https://your-service-name.onrender.com
```

Test endpoints:
- `GET /` - Health check
- `POST /api/auth/register` - User registration
- `GET /api/posts` - Get posts

## 📱 Frontend Configuration

Update your frontend's API configuration to use:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-service.onrender.com/api'
  : 'http://localhost:8000/api';
```

## 🔐 Security Notes

- Keep your `JWT_SECRET` secret and never commit it to version control
- Use strong passwords for MongoDB Atlas
- Regularly rotate your secrets
- Enable IP whitelisting in MongoDB Atlas for production 