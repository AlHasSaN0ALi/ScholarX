const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    deleteAccount
} = require('../controllers/User');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(protect); // All routes after this middleware require authentication
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/update-password', updatePassword);
router.delete('/delete-account', deleteAccount);

module.exports = router;
