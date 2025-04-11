const Course = require('../models/Course');
const JSendResponse = require('../utils/StandardResponse');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(
            JSendResponse.success({ course })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error( error.message )
        );
    }
};

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(
            JSendResponse.success({ courses })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message )
        );
    }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ course })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error( error.message )
        );
    }
};

// Update a course
exports.updateCourse = async (req, res) => { 
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) { 
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ course })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error( error.message )
        );
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ message: 'Course deleted successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message )
        );
    }
};

// Get all users subscribed to a course
exports.getCourseUsers = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('subscriptions');
        if (!course) {
            return res.json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ subscriptions: course.subscriptions })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message )
        );
    }
};

