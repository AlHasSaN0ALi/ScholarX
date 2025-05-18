const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    submitAmbassadorApplication,
    submitMentorshipRequest,
    getApplicationsByUser,
    getApplicationStatus
} = require('../controllers/ProgramController');

// Ambassador Program Routes
router.post('/ambassador/apply', protect , submitAmbassadorApplication);
router.get('/ambassador/status/:id',  protect,getApplicationStatus);

// Mentorship Program Routes
router.post('/mentorship/request',  protect,submitMentorshipRequest);
router.get('/mentorship/status/:id',  protect,getApplicationStatus);

// Get all applications for a user
router.get('/my-applications', getApplicationsByUser);

module.exports = router; 