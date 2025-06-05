# 🚀 Blog Application Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Variables Setup
```bash
# Copy the environment example file
cp env.example .env
```

Then edit `.env` with your actual values:
- Get MongoDB connection string from MongoDB Atlas
- Generate a JWT secret
- Get Gemini API key from Google AI Studio

### 3. Development
```bash
# Run both frontend and backend in development mode
npm run dev
```

This will start:
- Backend API on `http://localhost:8000`
- Frontend React app on `http://localhost:3000`

### 4. Production Build
```bash
# Build the entire application
npm run build
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development |
| `npm run dev:api` | Start only the backend API |
| `npm run dev:client` | Start only the frontend React app |
| `npm run build` | Build both frontend and backend for production |
| `npm run start` | Start the production server |
| `npm run install:all` | Install dependencies for root, api, and client |
| `npm run clean` | Remove all node_modules folders |

## 🔧 Environment Variables

### Required Variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for authentication
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 8000)
- `REACT_APP_API_URL` - API URL (use `/api` for production)
- `REACT_APP_GEMINI_API_KEY` - Google Gemini AI API key

## 🌐 Single-Service Deployment on Render

Deploy as **one web service** that serves both API and React frontend:

1. **Build Command**: `npm run render-build`
2. **Start Command**: `npm start`
3. **Environment Variables**: Set all variables in Render dashboard
4. **Root Directory**: Leave empty (uses repository root)

See `RENDER_SINGLE_DEPLOYMENT.md` for detailed deployment instructions.

## 📁 Project Structure
```
├── api/                 # Backend Express server
├── client/              # Frontend React app
├── package.json         # Root package.json with scripts
├── env.example          # Environment variables template
└── RENDER_DEPLOYMENT.md # Detailed deployment guide
```

## 🔍 Troubleshooting

- **Can't connect to MongoDB**: Check your connection string and network access
- **CORS errors**: Ensure `FRONTEND_URL` matches your frontend URL exactly
- **AI features not working**: Verify your `REACT_APP_GEMINI_API_KEY` is valid
- **Authentication issues**: Make sure `JWT_SECRET` is set and consistent

## 🎯 Next Steps

1. Set up your MongoDB Atlas database
2. Get your Google Gemini API key
3. Configure your environment variables
4. Run `npm run dev` to start development
5. Deploy to Render using the deployment guide 