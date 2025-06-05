import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  desc: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: null
  },
  cat: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
postSchema.index({ cat: 1 });
postSchema.index({ uid: 1 });
postSchema.index({ date: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post; 