const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  ip: {
    type: String,
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false },
});

module.exports = mongoose.models && mongoose.models.ActivityLog
  ? mongoose.models.ActivityLog
  : mongoose.model('ActivityLog', activityLogSchema);
