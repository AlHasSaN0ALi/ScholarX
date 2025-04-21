require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi'], // add the formats you want to allow
        transformation: [{ width: 1280, height: 720, crop: "limit" }] // optional transformations
    }
});

const uploadVideo = multer({ 
    storage: storage,
    limits: {
        fileSize: 100000000 // 100MB in bytes
    }
});

module.exports = {
    cloudinary,
    uploadVideo
};
