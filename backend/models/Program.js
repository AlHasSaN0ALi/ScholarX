const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['ambassador', 'mentorship']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    applicationData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    adminNotes: {
        type: String,
        default: ''
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Program', programSchema); 