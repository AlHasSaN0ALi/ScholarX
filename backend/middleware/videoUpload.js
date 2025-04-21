const { uploadVideo } = require('../config/cloudinary');

const handleVideoUpload = uploadVideo.single('videoUrl');

module.exports = handleVideoUpload;
