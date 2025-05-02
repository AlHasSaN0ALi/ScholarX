// controllers/Payment.js
const axios = require('axios');
const Course = require('../models/Course');
const User = require('../models/User');
const JSendResponse = require('../utils/StandardResponse');

// Fawaterk API configuration
const FAWATERK_API_URL = 'https://staging.fawaterk.com/api/v2/createInvoiceLink';
const FAWATERK_API_KEY = process.env.FAWATERK_API_KEY;
const FAWATERK_PROVIDER_KEY = process.env.FAWATERK_PROVIDER_KEY; 

// Create a payment request
const createPayment = async (req, res) => {
  try {
    const { courseId } = req.params;
    let userId;

    // Check if user is authenticated (req.user exists from authentication middleware)
    if (req.user && req.user._id) {
      userId = req.user._id; // Use authenticated user ID
    } else {
      // Fallback to userId from request body (temporary solution)
      userId = req.body.userId;
      if (!userId) {
        return res.status(400).json(
          JSendResponse.fail({ message: 'User ID is required' })
        );
      }
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(
        JSendResponse.fail({ message: 'User not found' })
      );
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(
        JSendResponse.fail({ message: 'Course not found' })
      );
    }

    // Check if user is already subscribed
    if (course.subscriptions.includes(userId)) {
      return res.status(400).json(
        JSendResponse.fail({ message: 'You are already subscribed to this course' })
      );
    }

    // Prepare payment data for Fawaterk - exactly matching documentation
    const paymentData = {
      cartItems: [
        {
          name: course.title,
          price: course.currentPrice.toString(),
          quantity: "1"
        }
      ],
      cartTotal: course.currentPrice,
      shipping: 0,
      customer: {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phoneNumber || "0123456789",
        address: "Online Course"
      },
      currency: "EGP",
      payLoad: {},
      sendEmail: true,
      sendSMS: false
    };

    
    // Send request to Fawaterk API
    const response = await axios.post(FAWATERK_API_URL, paymentData, {
      headers: {
        'Authorization': `Bearer 1be20fd63420d7023d2c0b4d00befb43df4707be1b800c373a`,
        'Content-Type': 'application/json'
      }
    });


    if (response.data.status !== 'success') {
      return res.status(500).json(
        JSendResponse.error('Failed to create payment request')
      );
    }

    // Return the payment URL to redirect the user
    res.status(200).json(
      JSendResponse.success({
        paymentUrl: response.data.data.url,
      })
    );
  } catch (error) {
    console.error('Payment creation error:', error.response?.data || error.message);
    res.status(500).json(
      JSendResponse.error(error.response?.data?.message || error.message)
    );
  }
};

// Handle Fawaterk Webhook
const handleWebhook = async (req, res) => {
  try {
    const { transaction_id, status, invoice } = req.body;

    if (!transaction_id || !status || !invoice) {
      return res.status(400).json(
        JSendResponse.fail({ message: 'Invalid webhook data' })
      );
    }

    // Verify the webhook data (you may need to add signature verification based on Fawaterk docs)
    if (status === 'paid') {
      // Payment successful
      const courseId = invoice.items[0]?.metadata?.courseId; // Use courseId from metadata
      const userEmail = invoice.customer.email;

      // Find user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        console.error('User not found for email:', userEmail);
        return res.status(404).json(
          JSendResponse.fail({ message: 'User not found' })
        );
      }

      // Find course by ID
      const course = await Course.findById(courseId);
      if (!course) {
        console.error('Course not found for ID:', courseId);
        return res.status(404).json(
          JSendResponse.fail({ message: 'Course not found' })
        );
      }

      // Add user to course subscriptions
      if (!course.subscriptions.includes(user._id)) {
        course.subscriptions.push(user._id);
        await course.save();
      }

      // Add course to user's courses
      if (!user.courses.includes(course._id)) {
        user.courses.push(course._id);
        await user.save();
      }

      console.log(`Payment successful for user ${userEmail} and course ${course.title}`);
    } else if (status === 'failed' || status === 'canceled') {
      // Payment failed or canceled
      console.log('Payment failed or canceled:', transaction_id);
    }

    // Respond to Fawaterk to acknowledge receipt of webhook
    res.status(200).json(
      JSendResponse.success({ message: 'Webhook received' })
    );
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json(
      JSendResponse.error(error.message)
    );
  }
};

module.exports = {
  createPayment,
  handleWebhook
};