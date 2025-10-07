const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/Admin');
const { handleImageUpload } = require('../utils/cloudinaryConfig');

// Dashboard routes
router.get('/dashboard/stats', protect, authorize('admin'), adminController.getDashboardStats);

// User management routes
router.get('/users', protect, authorize('admin'), adminController.getUsers);
router.get('/users/:id', protect, authorize('admin'), adminController.getUser);
router.patch('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.patch('/users/:id/status', protect, authorize('admin'), adminController.updateUserStatus);
router.patch('/users/:id/block', protect, authorize('admin'), adminController.blockUser);
router.patch('/users/:id/unblock', protect, authorize('admin'), adminController.unblockUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

// Course management routes
router.get('/courses', protect, authorize('admin'), adminController.getCourses);
router.get('/courses/:id', protect, authorize('admin'), adminController.getCourse);
router.post('/courses', protect, authorize('admin'), handleImageUpload, adminController.createCourse);
router.patch('/courses/:id', protect, authorize('admin'), handleImageUpload, adminController.updateCourse);
router.patch('/courses/:id/status', protect, authorize('admin'), adminController.updateCourseStatus);
router.post('/courses/:id/enroll', protect, authorize('admin'), adminController.enrollUserToCourse);
router.delete('/courses/:id/enroll', protect, authorize('admin'), adminController.revokeUserFromCourse);
router.delete('/courses/:id', protect, authorize('admin'), adminController.deleteCourse);

// Lesson management routes
router.post('/courses/:courseId/lessons', protect, authorize('admin'), adminController.createLesson);
router.put('/lessons/:id', protect, authorize('admin'), adminController.updateLesson);
router.delete('/lessons/:id', protect, authorize('admin'), adminController.deleteLesson);

// Subscription management routes
router.get('/subscriptions', protect, authorize('admin'), adminController.getSubscriptions);
router.get('/subscriptions/:id', protect, authorize('admin'), adminController.getSubscription);
router.patch('/subscriptions/:id', protect, authorize('admin'), adminController.updateSubscription);

// Report routes
router.get('/reports/revenue', protect, authorize('admin'), adminController.getRevenueReport);
router.get('/reports/users', protect, authorize('admin'), adminController.getUserReport);
router.get('/reports/courses', protect, authorize('admin'), adminController.getCourseReport);

module.exports = router; 