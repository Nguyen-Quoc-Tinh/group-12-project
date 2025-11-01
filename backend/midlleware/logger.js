const Log = require('../models/logModel');

exports.logError = async (err, req, res, next) => {
  try {
    await Log.create({
      level: 'error',
      message: err.message,
      stack: err.stack,
      context: {
        method: req.method,
        url: req.originalUrl,
        userId: req.user?._id || null,
      },
    });
  } catch (loggingError) {
    console.error('Failed to persist error log:', loggingError.message);
  }

  next(err);
};

exports.logInfo = async (message, context = {}) => {
  try {
    await Log.create({
      level: 'info',
      message,
      context,
    });
  } catch (err) {
    console.error('Failed to persist info log:', err.message);
  }
};
