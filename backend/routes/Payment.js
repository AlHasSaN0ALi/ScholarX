// routes/Payment.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

router.post('/create-payment/:courseId', paymentController.createPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;