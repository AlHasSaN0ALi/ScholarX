const express = require('express');
const router = express.Router();
const courseController = require('../controllers/Course');

router.post('/', courseController.createCourse);

router.get('/', courseController.getCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/scholarx', courseController.getScholarXCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/users/:id', courseController.getCourseUsers);

// New routes for category-based courses



module.exports = router;
  