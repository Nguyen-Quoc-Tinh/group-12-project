const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
	type: String,
	required: true,
	trim: true,
  },
  email: {
	type: String,
	required: true,
	unique: true,
	lowercase: true,
	trim: true,
  },
  password: {
	type: String,
	required: true,
  },
  role: {
	type: String,
	enum: ['user', 'admin', 'moderator'],
	default: 'user',
  },
  avatar: {
	type: String,
	default: null,
  },
  avatarPublicId: {
	type: String,
	default: null,
  },
  resetPasswordToken: {
	type: String,
	default: null,
  },
  resetPasswordExpires: {
	type: Date,
	default: null,
  },
}, {
  timestamps: true,
});

// Hash password before saving if it was created/changed
userSchema.pre('save', async function hashPassword(next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.models && mongoose.models.User
	? mongoose.models.User
	: mongoose.model('User', userSchema);
