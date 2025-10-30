const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// TTL index automatically removes expired refresh tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models && mongoose.models.RefreshToken
  ? mongoose.models.RefreshToken
  : mongoose.model('RefreshToken', refreshTokenSchema);
