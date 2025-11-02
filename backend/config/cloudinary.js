const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Debug: mask secrets when logging so we can see what's loaded
function mask(value) {
  if (!value) return '<empty>';
  if (value.length <= 4) return '****';
  return value.slice(0, 2) + '...' + value.slice(-2);
}

console.log('[cloudinary] env CLOUDINARY_CLOUD_NAME=', process.env.CLOUDINARY_CLOUD_NAME || '<empty>');
console.log('[cloudinary] env CLOUDINARY_API_KEY=', mask(process.env.CLOUDINARY_API_KEY));
console.log('[cloudinary] env CLOUDINARY_API_SECRET=', mask(process.env.CLOUDINARY_API_SECRET));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
