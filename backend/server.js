const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (try to load routes but don't crash if files missing)
try {
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
} catch (err) {
  console.warn("⚠️  authRoutes not found: ./routes/authRoutes (skipping)");
}

try {
  const userRoutes = require("./routes/userRoutes");
  app.use("/api/users", userRoutes);
} catch (err) {
  console.warn("⚠️  userRoutes not found: ./routes/userRoutes (skipping)");
}

try {
  const profileRoutes = require("./routes/profileRoutes");
  app.use("/api/profile", profileRoutes);
} catch (err) {
  console.warn("⚠️  profileRoutes not found: ./routes/profileRoutes (skipping)");
}

// Check environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment. Please set MONGO_URI in your .env file.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn("⚠️  Warning: JWT_SECRET is not set in environment. Authentication may fail.");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
