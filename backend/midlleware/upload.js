// backend/middleware/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

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
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only jpg/jpeg/png files are allowed"), false);
    }
    cb(null, true);
  },
});

export default upload;
