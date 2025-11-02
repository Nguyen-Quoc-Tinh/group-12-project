const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars", // thư mục trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    // optional: public_id: (req, file) => `user_${req.user.id}_${Date.now()}`
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // giới hạn 2MB (tùy chỉnh)
  fileFilter: (req, file, cb) => {
    // Hỗ trợ thêm webp, heic/heif từ điện thoại
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (!allowed.includes(file.mimetype)) {
      console.warn(`Rejected upload mimeType=${file.mimetype} filename=${file.originalname}`);
      // Trả lỗi rõ ràng để client biết nguyên nhân
      return cb(new Error("Only jpg/jpeg/png/webp/heic/heif files are allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
