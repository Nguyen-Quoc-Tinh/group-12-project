const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 📌 TẠM THỜI COMMENT CÁC ROUTE CHƯA LÀM
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const profileRoutes = require("./routes/profileRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/profile", profileRoutes);

// ✅ KẾT NỐI MONGODB
if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment. Please set MONGO_URI in your .env file.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ ROUTE KIỂM TRA SERVER
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ KHỞI ĐỘNG SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));