// controllers/Payment.js
const axios = require('axios');
const Course = require('../models/Course');
const User = require('../models/User');
const JSendResponse = require('../utils/StandardResponse');
const Subscription = require('../models/Subscription');

// Paymob API configuration (use your real credentials in production)
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || 'YOUR_PAYMOB_API_KEY';
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || 'YOUR_INTEGRATION_ID'; // Card payments
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || 'YOUR_IFRAME_ID';
const PAYMOB_API_URL = 'https://accept.paymob.com/api';

// Create a payment request (Paymob)
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

    // 1. Authenticate and get Paymob token
    const authResp = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
      api_key: PAYMOB_API_KEY
    });
    const paymobToken = authResp.data.token;

    // 2. Register order
    const orderResp = await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`, {
      auth_token: paymobToken,
      delivery_needed: false,
      amount_cents: (course.currentPrice * 100).toString(),
      currency: 'EGP',
      items: [
        {
          name: course.title,
          amount_cents: (course.currentPrice * 100).toString(),
          description: course.description || 'Course',
          quantity: 1,
          userId:course._id || "id",
        }
      ],
      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString()
      }
    });
    const orderId = orderResp.data.id;

    // 3. Request payment key
    const paymentKeyResp = await axios.post(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
      auth_token: paymobToken,
      amount_cents: (course.currentPrice * 100).toString(),
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: 'NA',
        email: user.email,
        floor: 'NA',
        first_name: user.firstName,
        street: 'NA',
        building: 'NA',
        phone_number: user.phoneNumber || '0123456789',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'EG',
        last_name: user.lastName,
        state: 'NA'
      },
      currency: 'EGP',
      integration_id: PAYMOB_INTEGRATION_ID,
      lock_order_when_paid: true,
      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString()
      }
    });
    const paymentKey = paymentKeyResp.data.token;

    // 4. Return the payment URL (Paymob iframe)
    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.status(200).json(
      JSendResponse.success({
        paymentUrl
      })
    );
  } catch (error) {
    console.error('Paymob Payment creation error:', error.response?.data || error.message);
    res.status(500).json(
      JSendResponse.error(error.response?.data?.message || error.message)
    );
  }
};

// Handle Paymob Webhook
const handleWebhook = async (req, res) => {
  try {
    const { obj } = req.body;
    console.log('Paymob Webhook received:', obj.success, obj.is_paid, obj.order);
    console.log('Order object:', JSON.stringify(obj.order, null, 2));
    if (!obj || !obj.success) {
      return res.status(200).json({ status: 'ignored' });
    }

    // 1. Extract user email and course title (fallback method)
    const userEmail = obj.order?.shipping_data?.email || obj.order?.billing_data?.email;
    const courseTitle = obj.order?.items?.[0]?.name;

    // 2. Find user and course by email and title
    const user = await User.findOne({ email: userEmail });
    const course = await Course.findOne({ title: courseTitle });

    if (!user || !course) {
      return res.status(404).json({ status: 'fail', message: 'User or course not found' });
    }

    // 3. Add user to course.subscriptions if not already present
    await Course.findByIdAndUpdate(
      course._id,
      { $addToSet: { subscriptions: user._id } }
    );

    // 4. Add course to user.courses if not already present
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { courses: course._id } }
    );

    // 5. Create a Subscription document if not already present for this user/course/paymentId
    const existing = await Subscription.findOne({ user: user._id, course: course._id, paymentId: obj.id });
    if (!existing) {
      await Subscription.create({
        user: user._id,
        course: course._id,
        amount: obj.amount_cents / 100, // EGP
        status: 'active',
        paymentId: obj.id,
        startDate: new Date(),
      });
    }

    return res.status(200).json({ status: 'success', message: 'User enrolled in course' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createPayment,
  handleWebhook
};