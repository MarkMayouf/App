import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  img: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries (email and username already have unique indexes)
// userSchema.index({ email: 1 }); // Removed - unique: true already creates this index
// userSchema.index({ username: 1 }); // Removed - unique: true already creates this index

const User = mongoose.model('User', userSchema);

export default User; 