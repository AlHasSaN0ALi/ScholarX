let env = require('dotenv')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const courseRoutes = require('./routes/Course');
const lessonRoutes = require('./routes/Lesson');
const emailRoutes = require('./routes/nodemailer');
const categoryRoutes = require('./routes/Category');
const userRoutes = require('./routes/User');
const passport = require('passport');
const paymentRoutes = require('./routes/Payment');
const programsRoutes = require('./routes/programs');
const adminRoutes = require('./routes/admin');
const path = require('path');
require('./config/passport');

env.config()
const app = express();
const PORT = 3000;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
