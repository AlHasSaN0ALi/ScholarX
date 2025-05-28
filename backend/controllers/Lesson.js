const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const JSendResponse = require('../utils/StandardResponse');

// Middleware to check if user is subscribed to the course
const checkSubscription = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Authentication required' })
            );
        }

        // Check if user is subscribed
        const isSubscribed = course.subscriptions.includes(req.user._id);
        if (!isSubscribed) {
            return res.status(403).json(
                JSendResponse.fail({ message: 'Subscription required to access this lesson' })
            );
        }

        next();
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.createLesson = async (req, res) => {
    try {
        // Check if course exists
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }

        // Create lesson object
        const lessonData = {
            ...req.body,
            courseId: req.params.courseId
        };

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
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getLessonsByCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId })
            .sort('order');
        
        // For non-subscribed users, only return basic lesson info
        const course = await Course.findById(req.params.courseId);
        const isSubscribed = req.user && course.subscriptions.includes(req.user._id);
console.log(course);
console.log(isSubscribed);

        const lessonData = lessons.map(lesson => {
            if (isSubscribed) {
                return {
                    ...lesson.toObject(),
                    videoUrl: lesson.getEmbedUrl()
                };
            }
            return {
                _id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                duration: lesson.duration,
                order: lesson.order,
                isLocked: true
            };
        });

        res.status(200).json(
            JSendResponse.success({ lessons: lessonData })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getLessonById = [checkSubscription, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
        }

        // Convert YouTube URL to embed URL
        const lessonData = {
            ...lesson.toObject(),
            videoUrl: lesson.getEmbedUrl()
        };

        res.status(200).json(
            JSendResponse.success({ lesson: lessonData })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
}];

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

exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
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

