const express = require('express');
const router = express.Router();
const courseController = require('../controllers/Course');

router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/users/:id', courseController.getCourseUsers);

module.exports = router;
  