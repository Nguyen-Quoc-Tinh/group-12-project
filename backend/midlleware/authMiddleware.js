// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "Không có token, từ chối truy cập" });
//     }

//     // Giải mã token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Tìm user tương ứng từ DB (single source of truth)
//     req.user = await User.findById(decoded.id).select("-password");
//     if (!req.user) {
//       return res.status(404).json({ message: "Không tìm thấy người dùng" });
//     }

//     // Debug: log id and role to help trace authorization flows (no password)
//     console.debug(`authMiddleware.protect: loaded user ${req.user._id} role=${req.user.role}`);

//     next(); // tiếp tục qua controller
//   } catch (err) {
//     res.status(401).json({ message: "Token không hợp lệ", error: err.message });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ActivityLog = require("../models/activityLogModel");

// Middleware: Xác thực token và gắn user vào req.user
exports.protect = async (req, res, next) => {
  try {
    // Lấy token từ header (dạng: "Bearer <token>")
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token, từ chối truy cập" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user tương ứng trong DB (không lấy password)
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Debug log (có thể tắt sau)
    console.debug(`✅ Authenticated: user=${req.user._id}, role=${req.user.role}`);

    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware: Chỉ cho phép admin truy cập
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Bạn không có quyền admin để truy cập tài nguyên này" });
  }
};

// Middleware: Cho phép admin hoặc chính chủ (ví dụ xóa/sửa tài khoản của mình)
exports.allowSelfOrAdmin = (req, res, next) => {
  // Nếu là admin → ok
  if (req.user.role === "admin") {
    return next();
  }

  // Nếu user đang truy cập tài khoản của chính mình → ok
  if (req.user._id.toString() === req.params.id) {
    return next();
  }

  // Còn lại → bị chặn
  res.status(403).json({ message: "Bạn chỉ có thể thao tác với tài khoản của chính mình" });
};

// Ghi log hoạt động của request
exports.logActivity = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  const writeLog = async (statusCode, errorMessage) => {
    try {
      await ActivityLog.create({
        userId: req.user?._id || null,
        action: originalUrl,
        ip: req.ip,
        metadata: {
          method,
          statusCode,
          durationMs: Date.now() - start,
          error: errorMessage || null,
        },
      });
    } catch (err) {
      console.error("Failed to write activity log:", err.message);
    }
  };

  res.on("finish", () => {
    writeLog(res.statusCode).catch(() => {});
  });

  res.on("close", () => {
    if (!res.writableEnded) {
      writeLog(res.statusCode, "connection closed").catch(() => {});
    }
  });

  next();
};
