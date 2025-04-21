let env = require('dotenv')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/Course');
const lessonRoutes = require('./routes/Lesson');


env.config()
const app = express();
const PORT = 3000;


// Middleware
app.use(cors({
    origin: '*'
  }))
  ;
app.use(express.json());

// MongoDB connection
mongoose.connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    
// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Use course routes
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
