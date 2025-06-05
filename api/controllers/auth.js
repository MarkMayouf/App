import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
      return res.status(409).json("User already exists!");
    }

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });

    await newUser.save();
    return res.status(200).json("User has been created.");

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  try {
    // Check user
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password!");
    }

    // Use environment variable for JWT secret
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "jwtkey");
    const { password, ...other } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      .status(200)
      .json(other);

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }).status(200).json("User has been logged out.")
};