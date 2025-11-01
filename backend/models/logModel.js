const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warn', 'error'],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  stack: {
    type: String,
    default: null,
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models && mongoose.models.Log
  ? mongoose.models.Log
  : mongoose.model('Log', logSchema);
