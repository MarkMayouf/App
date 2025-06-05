import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"
import dotenv from 'dotenv';
import connectDB from './db.js';

dotenv.config(); 

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow same origin for single-service deployment
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Environment logging
if (process.env.NODE_ENV === "production") {
  console.log("App is running in production mode");
} else {
  console.log("App is running in development mode");
}

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory in current directory for production
    const uploadPath = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, "uploads")
      : path.join(__dirname, "../client/public/upload");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// Serve uploaded files statically
const staticPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, "uploads")
  : path.join(__dirname, "../client/public/upload");

app.use("/upload", express.static(staticPath));

// File upload endpoint
app.post("/api/upload", upload.single("file"), function (req, res) {
  if (!req.file) {
    console.error("Upload error: No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file;
  res.status(200).json(file.filename);
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing - send all non-API requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Health check endpoint for development
  app.get("/", (req, res) => {
    res.json({ 
      message: "🚀 Blog API Server is running!", 
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });
}

// Use dynamic port for production deployment
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});