const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { 
        url: { type: String },
        public_id: { type: String }
    },
    subscriptions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        onDelete: 'SET_NULL'
    }], 
    category: { 
        type: String, 
        required: true,
        enum: ['Featured', 'ScholarX'],
        index: true
    }, 
    currentPrice: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    instructor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        // This will set the reference to null if the user is deleted
        onDelete: 'SET_NULL',
        default: null
    },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    totalDuration: { type: Number, default: 0 }, 
    totalLessons: { type: Number, default: 0 },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for handling deleted instructor
courseSchema.virtual('instructorInfo').get(function() {
    if (!this.instructor) {
        return {
            name: 'Former Instructor',
            email: 'N/A',
            profilePicture: null
        };
    }
    return this.instructor;
});

module.exports = mongoose.model('Course', courseSchema);
 
