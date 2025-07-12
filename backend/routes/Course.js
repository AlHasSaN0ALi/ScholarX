const express = require('express');
const router = express.Router();
const courseController = require('../controllers/Course');
const { searchCourses } = require('../controllers/Search');
const { protect, optionalAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), courseController.createCourse);

router.get('/', optionalAuth, courseController.getCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/scholarx', courseController.getScholarXCourses);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', upload.single('image'), courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/users/:id', courseController.getCourseUsers);
router.get('/search', searchCourses);
router.get('/:id/subscription-status', courseController.checkSubscriptionStatus);

// Fetch multiple courses by IDs
router.post('/by-ids', protect, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'No course IDs provided' });
    }
    const courses = await Course.find({ _id: { $in: ids } });

    // Add isSubscribed for each course if user is logged in
    let userId = req.user?._id?.toString();
    const coursesWithSubscription = courses.map(course => {
      let isSubscribed = false;
      if (userId && course.subscriptions && Array.isArray(course.subscriptions)) {
        isSubscribed = course.subscriptions.map(id => id.toString()).includes(userId);
      }
      return { ...course.toObject(), isSubscribed };
    });

    res.json({ status: 'success', data: { courses: coursesWithSubscription } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// New routes for category-based courses

module.exports = router;
  