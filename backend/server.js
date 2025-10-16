require('dotenv').config();
const express = require('express');
const app = express(); // 👉 Khởi tạo app trước khi dùng

// Middleware để đọc JSON từ body
app.use(express.json());

// Import route
const userRoutes = require('./routes/user');

// Sử dụng routes cho endpoint /api/users
app.use('/api/users', userRoutes);

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Cấu hình cổng
const PORT = process.env.PORT || 3000;

// Khởi động server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));