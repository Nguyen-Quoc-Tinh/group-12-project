const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users → Lấy danh sách user
router.get('/', userController.getUsers);

// POST /api/users → Thêm user mới
router.post('/', userController.createUser);

module.exports = router;