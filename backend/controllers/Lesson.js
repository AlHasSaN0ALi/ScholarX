const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const JSendResponse = require('../utils/StandardResponse');
const { cloudinary } = require('../utils/cloudinaryConfig');

exports.createLesson = async (req, res) => {
    try {
        console.log(req.file);
        
        // Check if course exists
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            // If there's a video uploaded, delete it from cloudinary
            if (req.file) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }

        // Create lesson object with video URL if a file was uploaded
        const lessonData = {
            ...req.body,
            courseId: req.params.courseId
        };

        if (req.file) {
            lessonData.videoUrl = req.file.path;
        }

        const lesson = await Lesson.create(lessonData);

        // Update course
        await Course.findByIdAndUpdate(
            req.params.courseId,
            {
                $push: { lessons: lesson._id },
                $inc: { 
                    totalLessons: 1,
                    totalDuration: lesson.duration || 0
                }
            }
        );

        res.status(201).json(
            JSendResponse.success({ lesson })
        );
    } catch (error) {
        // If there's an error and a file was uploaded, delete it
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getLessonsByCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId })
            .sort('order');
        res.status(200).json(
            JSendResponse.success({ lessons })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ lesson })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ lesson })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Add a method to update video
exports.updateLessonVideo = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            if (req.file) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
        }

        // If lesson already has a video, delete it from cloudinary
        if (lesson.videoUrl) {
            const publicId = lesson.videoUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }

        // Update lesson with new video URL
        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            { videoUrl: req.file.path },
            { new: true }
        );

        res.status(200).json(
            JSendResponse.success({ lesson: updatedLesson })
        );
    } catch (error) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Update delete method to handle video deletion
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
        }

        // Delete video from cloudinary if it exists
        if (lesson.videoUrl) {
            const publicId = lesson.videoUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }

        // Update course
        await Course.findByIdAndUpdate(
            lesson.courseId,
            {
                $pull: { lessons: lesson._id },
                $inc: { 
                    totalLessons: -1,
                    totalDuration: -(lesson.duration || 0)
                }
            }
        );

        await Lesson.findByIdAndDelete(req.params.id);

        res.status(200).json(
            JSendResponse.success({ message: 'Lesson deleted successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

