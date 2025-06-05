import connectDB from './db.js';
import User from './models/User.js';
import Post from './models/Post.js';

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Connect to database
    await connectDB();
    
    // Test creating indexes
    await User.createIndexes();
    await Post.createIndexes();
    
    console.log('✅ MongoDB connection successful!');
    console.log('✅ Models initialized successfully!');
    console.log('✅ Database indexes created!');
    
    // Test basic operations
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    console.log(`📊 Current users: ${userCount}`);
    console.log(`📊 Current posts: ${postCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

testConnection(); 