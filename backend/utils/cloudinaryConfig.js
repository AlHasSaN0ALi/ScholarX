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

// Configure Storage for Videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi','mkv'],
        transformation: [{ width: 1280, height: 720, crop: "limit" }]
    }
});

// Configure Storage for Images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 600, crop: "limit" }]
    }
});

// Configure Storage for Profile Images
const profileImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ 
            width: 400, 
            height: 400, 
            crop: "fill",
            gravity: "face",
            quality: "auto",
            fetch_format: "auto"
        }]
    }
});

// Configure Multer with Cloudinary Storage
const uploadVideo = multer({ 
    storage: videoStorage,
    limits: {
        fileSize: 100000000 // 100MB in bytes
    }
}).single('videoUrl'); 

const uploadImage = multer({ 
    storage: imageStorage,
    limits: {
        fileSize: 5000000 // 5MB in bytes
    }
}).single('image'); 

const uploadProfileImage = multer({ 
    storage: profileImageStorage,
    limits: {
        fileSize: 5000000 // 5MB in bytes
    }
}).single('image'); 

module.exports = {
    cloudinary,
    handleVideoUpload: uploadVideo,
    handleImageUpload: uploadImage,
    handleProfileImageUpload: uploadProfileImage
};
