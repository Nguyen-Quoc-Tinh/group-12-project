// Mảng dữ liệu tạm thời (chưa có database)
let users = [
  { id: 1, name: 'Nguyen Van A', gender: 'male' },
  { id: 2, name: 'Tran Thi B', gender: 'female' }
];

// [GET] /api/users → Lấy toàn bộ users
exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

// [POST] /api/users → Tạo user mới
exports.createUser = (req, res) => {
  const { name, gender } = req.body;

  if (!name || !gender) {
    return res.status(400).json({ message: 'Name and gender are required.' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    gender
  };

  users.push(newUser);
  res.status(201).json(newUser);
};