const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { 
        url: { type: String },
        public_id: { type: String }
    },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
    currentPrice: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    instructor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        // required: true 
    },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    totalDuration: { type: Number, default: 0 }, 
    totalLessons: { type: Number, default: 0 }, 
}, { timestamps: true });



module.exports = mongoose.model('Course', courseSchema);
 
