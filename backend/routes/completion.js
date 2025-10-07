const express = require('express');
const router = express.Router();
const completionController = require('../controllers/Completion');
const { protect } = require('../middleware/auth');

// Lesson completion routes
router.post('/lessons/complete', protect, completionController.markLessonComplete);
router.get('/courses/:courseId/completed-lessons', protect, completionController.getCompletedLessons);
router.get('/courses/:courseId/completion-status', protect, completionController.getCourseCompletionStatus);

// Course completion routes
router.get('/completed-courses', protect, completionController.getCompletedCourses);
router.get('/courses/:courseId/certificate', protect, completionController.generateCertificate);

module.exports = router;

