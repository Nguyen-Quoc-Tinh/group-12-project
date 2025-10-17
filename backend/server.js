require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ Thêm dòng này để cho phép frontend gọi API

const app = express(); // 👉 Khởi tạo app

// ✅ Middleware
app.use(cors()); // Cho phép mọi domain gọi API (frontend có thể kết nối)
app.use(express.json()); // Cho phép đọc JSON từ body

// ✅ Import routes
const userRoutes = require('./routes/user');

// ✅ Dùng routes cho endpoint /api/users
app.use('/api/users', userRoutes);

// ✅ Route test để kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Cấu hình cổng
const PORT = process.env.PORT || 3000;

// ✅ Khởi động server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));