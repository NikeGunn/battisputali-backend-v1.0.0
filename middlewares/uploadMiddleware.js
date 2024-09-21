// middlewares/uploadMiddleware.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    format: async () => 'mp4',
  },
});

const upload = multer({ storage });

module.exports = upload;
