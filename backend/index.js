let env = require('dotenv')
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
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
const completionRoutes = require('./routes/completion');
const path = require('path');
const JSendResponse = require('./utils/StandardResponse');
require('./config/passport');

env.config()
const app = express();
const PORT = process.env.PORT || 3001;

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

// Security & Performance Middleware
app.disable('x-powered-by');
app.set('trust proxy', process.env.NODE_ENV === 'production');

// Helmet with relaxed CORP to allow cross-origin images if needed
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS with allowlist
// const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_DASHBOARD_URL].filter(Boolean);
app.use(cors({
    origin: '*',
    credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);
app.use('/api/users', authLimiter);
app.use('/api/email', authLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

// Compression
app.use(compression());
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
app.use('/api/completion', completionRoutes);

// 404 handler
app.all('*', (req, res) => {
    return res.status(404).json(
        JSendResponse.fail({ message: 'Not Found' })
    );
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(status).json(
        JSendResponse.error(message)
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
