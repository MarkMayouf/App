# MongoDB Migration Guide

## Overview
This application has been successfully migrated from MySQL to MongoDB. This guide provides setup instructions and explains the changes made.

## Prerequisites

1. **Install MongoDB**: 
   - Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud solution)

2. **Start MongoDB Service**:
   ```bash
   # On Windows
   net start MongoDB

   # On macOS (using Homebrew)
   brew services start mongodb-community

   # On Linux
   sudo systemctl start mongod
   ```

## Environment Configuration

Create a `.env` file in the `api` directory with the following variables:

```env
# MongoDB Configuration
mongodb://localhost:27MONGODB_URI=017/blog

# OR use individual connection parameters:
DB_HOST=localhost
DB_PORT=27017
DB_NAME=blog

# Authentication
JWT_SECRET=your-secret-key-here

# Environment
NODE_ENV=development

# Frontend URL (for production CORS)
FRONTEND_URL=http://localhost:3000

# Server Port
PORT=8000
```

## Install Dependencies

Navigate to the `api` directory and install the new MongoDB dependencies:

```bash
cd api
npm install
```

This will install `mongoose` (the MongoDB ODM) instead of the previous MySQL packages.

## Database Schema

### User Model
- `username`: String (required, unique, 3-50 characters)
- `email`: String (required, unique, lowercase)
- `password`: String (required, hashed, min 6 characters)
- `img`: String (optional, profile image URL)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Post Model
- `title`: String (required, max 200 characters)
- `desc`: String (required, post content)
- `img`: String (optional, post image URL)
- `cat`: String (required, category)
- `date`: Date (default: current date)
- `uid`: ObjectId (reference to User, required)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Key Changes Made

### 1. Database Connection (`api/db.js`)
- Replaced MySQL connection with MongoDB connection using Mongoose
- Added connection error handling and retry logic

### 2. Data Models (`api/models/`)
- Created `User.js` and `Post.js` models with Mongoose schemas
- Added validation rules and indexes for performance

### 3. Controllers Updated
- **Auth Controller** (`api/controllers/auth.js`):
  - Replaced SQL queries with MongoDB operations
  - Added proper error handling with try-catch blocks
  - Maintained the same API response format

- **Post Controller** (`api/controllers/post.js`):
  - Replaced SQL JOIN queries with Mongoose population
  - Added proper MongoDB filtering and sorting
  - Maintained backward compatibility with existing API

### 4. Package Dependencies
- Removed: `mysql2`, `mysql`
- Added: `mongoose` (latest version)

## API Compatibility

The API endpoints remain unchanged:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts (with optional category filter)
- `GET /api/posts/:id` - Get single post with author info
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, owner only)
- `DELETE /api/posts/:id` - Delete post (authenticated, owner only)

## Running the Application

1. **Start MongoDB** (if running locally)
2. **Start the API server**:
   ```bash
   cd api
   npm run dev  # for development
   # or
   npm start    # for production
   ```
3. **Start the client** (in a separate terminal):
   ```bash
   cd client
   npm start
   ```

## Migration Benefits

1. **Scalability**: MongoDB handles large datasets more efficiently
2. **Flexibility**: Schema-less design allows for easier feature additions
3. **Performance**: Better performance for read-heavy applications
4. **Modern Stack**: More aligned with modern JavaScript development
5. **Cloud Ready**: Easier to deploy with MongoDB Atlas

## Troubleshooting

### Common Issues

1. **Connection Error**: Ensure MongoDB is running and accessible
2. **Authentication Error**: Check if JWT_SECRET is properly set
3. **Port Conflicts**: Make sure MongoDB is running on the correct port (default: 27017)

### Logs
The application now includes detailed logging for database operations and errors.

## MongoDB Atlas Setup (Cloud Alternative)

If you prefer using MongoDB Atlas (cloud):

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority
   ```

## Data Migration (If needed)

If you have existing MySQL data to migrate:

1. Export data from MySQL
2. Transform the data format (SQL rows to JSON documents)
3. Import using MongoDB tools or custom scripts

Contact support if you need assistance with data migration. 