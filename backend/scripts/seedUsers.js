const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/userModel');

async function seedUsers() {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment. Set it in your .env before running the seeder.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const users = [
      {
        name: 'Sample User',
        email: 'user@example.com',
        password: 'User@12345',
        role: 'user',
      },
      {
        name: 'Sample Admin',
        email: 'admin@example.com',
        password: 'Admin@12345',
        role: 'admin',
      },
      {
        name: 'Sample Moderator',
        email: 'moderator@example.com',
        password: 'Moderator@12345',
        role: 'moderator',
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.findOneAndUpdate(
        { email: user.email },
        {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('Seed users completed.');
    console.log('   - user@example.com / User@12345');
    console.log('   - admin@example.com / Admin@12345');
    console.log('   - moderator@example.com / Moderator@12345');
  } catch (err) {
    console.error('Failed to seed users:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
