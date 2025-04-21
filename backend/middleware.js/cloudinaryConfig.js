require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi','mkv'],
        transformation: [{ width: 1280, height: 720, crop: "limit" }]
    }
});

// Configure Multer with Cloudinary Storage
const uploadVideo = multer({ 
    storage: storage,
    limits: {
        fileSize: 100000000 // 100MB in bytes
    }
}).single('videoUrl'); 


module.exports = {
    cloudinary,
    handleVideoUpload: uploadVideo
};
