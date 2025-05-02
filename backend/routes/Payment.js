// routes/Payment.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment');
const  authenticateUser  = require('../middleware/auth');

// Create payment for a course
router.post('/create/:courseId', authenticateUser.protect, paymentController.createPayment);

// Handle Fawaterk webhook
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;