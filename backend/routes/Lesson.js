const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/Lesson');
const { protect, authorize } = require('../middleware/auth');

// Create a new lesson (admin only)
router.post('/courses/:courseId/lessons', 
    protect, 
    authorize('admin'), 
    lessonController.createLesson
);

// Get all lessons for a course
router.get('/courses/:courseId/lessons',protect, lessonController.getLessonsByCourse);

// Get a specific lesson (requires subscription)
router.get('/lessons/:id', protect, lessonController.getLessonById);

// Update a lesson (admin only)
router.put('/lessons/:id', 
    protect, 
    authorize('admin'), 
    lessonController.updateLesson
);

// Delete a lesson (admin only)
router.delete('/lessons/:id', 
    protect, 
    authorize('admin'), 
    lessonController.deleteLesson
);

module.exports = router;
 