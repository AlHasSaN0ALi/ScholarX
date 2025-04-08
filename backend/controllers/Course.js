const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(400).json({ message: 'Error creating course', error });
    }
};

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving courses', error });
    }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('subscriptions');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving course', error });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(400).json({ message: 'Error updating course', error });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error });
    }
};

// Get all users subscribed to a course
exports.getCourseUsers = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('subscriptions');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course.subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

