const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { 
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Validate YouTube URL format
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v);
            },
            message: props => `${props.value} is not a valid YouTube URL!`
        }
    },
    duration: { type: Number }, 
    order: { type: Number, required: true }, 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    isPrivate: { type: Boolean, default: true }
}, { timestamps: true });

// Method to get embed URL from YouTube URL
lessonSchema.methods.getEmbedUrl = function() {
    if (!this.videoUrl) return null;
    
    // Convert various YouTube URL formats to embed URL
    let videoId = '';
    if (this.videoUrl.includes('youtube.com/watch')) {
        videoId = this.videoUrl.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
    } else if (this.videoUrl.includes('youtu.be/')) {
        videoId = this.videoUrl.split('youtu.be/')[1];
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
};

module.exports = mongoose.model('Lesson', lessonSchema);