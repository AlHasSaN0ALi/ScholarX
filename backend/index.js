let env = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/Course');
const lessonRoutes = require('./routes/Lesson');
const emailRoutes = require('./routes/nodemailer');
const categoryRoutes = require('./routes/Category');
const paymentRoutes = require('./routes/Payment')
env.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

// MongoDB connection
mongoose.connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Use routes
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});