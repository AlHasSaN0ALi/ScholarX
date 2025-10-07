const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const { getContactFormEmail, getOpenCourseRequestEmail } = require('../utils/emailTemplates');

const sendContactEmail = async (firstName, lastName, email, message, type, course) => {
  const isAccessRequest = type === 'access_request';
  const subject = isAccessRequest
    ? `Course Access Request from ${firstName} ${lastName}`
    : `New Contact Form Message from ${firstName} ${lastName}`;

  const html = isAccessRequest
    ? getOpenCourseRequestEmail({ firstName, lastName, email, courseTitle: course?.title, courseId: course?.id })
    : getContactFormEmail({ firstName, lastName, email, message });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email' };
  }
};

module.exports = {
  sendContactEmail
}; 