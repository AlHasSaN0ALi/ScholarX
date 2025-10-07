const mongoose = require('mongoose');

const courseCompletionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
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
    completionPercentage: { 
        type: Number, 
        default: 100 
    },
    totalLessons: { 
        type: Number, 
        required: true 
    },
    completedLessons: { 
        type: Number, 
        required: true 
    },
    certificateId: { 
        type: String, 
        unique: true 
    }, // Unique certificate identifier
    certificateUrl: { 
        type: String 
    } // URL to the generated certificate
}, { 
    timestamps: true 
});

// Compound index to ensure one completion per user per course
courseCompletionSchema.index({ user: 1, course: 1 }, { unique: true });

// Generate unique certificate ID
courseCompletionSchema.pre('save', function(next) {
    if (!this.certificateId) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        this.certificateId = `CERT-${timestamp}-${random}`.toUpperCase();
    }
    next();
});

module.exports = mongoose.model('CourseCompletion', courseCompletionSchema);

