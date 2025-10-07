const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/nodemailer');

router.post('/', async (req, res) => {
  const { firstName, lastName, email, message, type, course } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  const result = await sendContactEmail(firstName, lastName, email, message, type, course);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

module.exports = router; 