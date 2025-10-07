const mongoose = require('mongoose');

const lessonCompletionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    lesson: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lesson', 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    completedAt: { 
        type: Date, 
        default: Date.now 
    },
    watchTime: { 
        type: Number, 
        default: 0 
    }, // in seconds
    completionPercentage: { 
        type: Number, 
        default: 0 
    } // percentage of video watched
}, { 
    timestamps: true 
});

// Compound index to ensure one completion per user per lesson
lessonCompletionSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('LessonCompletion', lessonCompletionSchema);

