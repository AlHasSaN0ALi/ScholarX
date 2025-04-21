const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/Lesson');
const {handleVideoUpload} = require('../utils/cloudinaryConfig');

router.post('/:courseId', handleVideoUpload, lessonController.createLesson);
router.patch('/:id/video', handleVideoUpload, lessonController.updateLessonVideo);
router.get('/course/:courseId', lessonController.getLessonsByCourse);
router.get('/:id', lessonController.getLessonById);
router.patch('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
