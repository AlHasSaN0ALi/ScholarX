const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String },
    duration: { type: Number }, 
    order: { type: Number, required: true }, 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);