import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  try {
    const filter = req.query.cat ? { cat: req.query.cat } : {};
    const posts = await Post.find(filter)
      .populate('uid', 'username img')
      .sort({ date: -1 });
    
    // Format posts to match original SQL query structure
    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      desc: post.desc,
      img: post.img,
      cat: post.cat,
      date: post.date,
      uid: post.uid._id,
      username: post.uid.username,
      userImg: post.uid.img
    }));
    
    return res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json(error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('uid', 'username img');

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    // Format the response to match the original SQL query structure
    const response = {
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

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json(error.message);
  }
};

export const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET || "jwtkey");

    const newPost = new Post({
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      cat: req.body.cat,
      date: req.body.date || new Date(),
      uid: userInfo.id
    });

    const savedPost = await newPost.save();
    console.log('Post created successfully:', { postId: savedPost._id, userId: userInfo.id });
    return res.json("Post has been created.");

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json("Token is not valid!");
    }
    console.error('Add post error:', error);
    return res.status(500).json(error.message);
  }
};

export const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET || "jwtkey");

    const result = await Post.findOneAndDelete({
      _id: req.params.id,
      uid: userInfo.id
    });

    if (!result) {
      return res.status(403).json("You can delete only your post!");
    }

    console.log('Post deleted successfully:', { postId: req.params.id, userId: userInfo.id });
    return res.json("Post has been deleted!");

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json("Token is not valid!");
    }
    console.error('Delete post error:', error);
    return res.status(500).json(error.message);
  }
};

export const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET || "jwtkey");

    const updateData = {
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      cat: req.body.cat
    };

    const result = await Post.findOneAndUpdate(
      { _id: req.params.id, uid: userInfo.id },
      updateData,
      { new: true }
    );

    if (!result) {
      return res.status(403).json("You can update only your post!");
    }

    console.log('Post updated successfully:', { postId: req.params.id, userId: userInfo.id });
    return res.json("Post has been updated.");

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json("Token is not valid!");
    }
    console.error('Update post error:', error);
    return res.status(500).json(error.message);
  }
};