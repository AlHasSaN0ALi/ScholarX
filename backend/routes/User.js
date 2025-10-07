const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,
    verifyEmail
} = require('../controllers/User');
const { handleProfileImageUpload } = require('../utils/cloudinaryConfig');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        try {
            console.log('Google callback - User:', req.user);
            // Generate JWT token
            const token = generateToken(req.user._id);
            console.log('Generated token:', token);
            
            // Redirect to frontend with token
            const redirectUrl = `${process.env.FRONTEND_URL}/auth/google?token=${token}`;
            console.log('Redirecting to:', redirectUrl);
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error in Google callback:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
        }
    }
);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(protect); // All routes after this middleware require authentication
router.patch('/profile', handleProfileImageUpload, updateProfile);
router.get('/profile', getProfile);
router.put('/update-password', updatePassword);
router.delete('/delete-account', deleteAccount);

module.exports = router;
