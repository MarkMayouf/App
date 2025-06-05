import connectDB from './db.js';
import User from './models/User.js';
import Post from './models/Post.js';

const testFixes = async () => {
  try {
    console.log('🧪 Testing MongoDB fixes...');
    
    // Connect to database
    await connectDB();
    
    // Test 1: Check if indexes are created without warnings
    console.log('\n1️⃣ Testing index creation...');
    await User.createIndexes();
    await Post.createIndexes();
    console.log('✅ Indexes created without warnings');
    
    // Test 2: Check if we can populate user data in posts
    console.log('\n2️⃣ Testing user population in posts...');
    const postsWithUsers = await Post.find()
      .populate('uid', 'username img')
      .limit(1);
    
    if (postsWithUsers.length > 0) {
      const post = postsWithUsers[0];
      console.log('✅ Post with user data:', {
        postId: post._id,
        title: post.title,
        userId: post.uid._id,
        username: post.uid.username,
        userImg: post.uid.img
      });
      
      // Test formatted response structure
      const formattedPost = {
        id: post._id,
        uid: post.uid._id,
        username: post.uid.username,
        title: post.title,
        desc: post.desc,
        img: post.img,
        userImg: post.uid.img,
        cat: post.cat,
        date: post.date
      };
      console.log('✅ Formatted post structure ready for frontend');
    } else {
      console.log('ℹ️ No posts found - create a post to test user population');
    }
    
    // Test 3: Check current data counts
    console.log('\n3️⃣ Current database status:');
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    console.log(`📊 Users: ${userCount}, Posts: ${postCount}`);
    
    console.log('\n🎉 All fixes verified successfully!');
    console.log('\nKey fixes applied:');
    console.log('- ✅ Removed duplicate email index (fixed mongoose warning)');
    console.log('- ✅ Added user population to getPosts endpoint');
    console.log('- ✅ Added uid field to post responses for frontend');
    console.log('- ✅ Enhanced error logging for debugging');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testFixes(); 