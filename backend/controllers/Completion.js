const LessonCompletion = require('../models/LessonCompletion');
const CourseCompletion = require('../models/CourseCompletion');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');
const JSendResponse = require('../utils/StandardResponse');

// Mark a lesson as completed
exports.markLessonComplete = async (req, res) => {
    try {
        const { lessonId, courseId, watchTime, completionPercentage } = req.body;
        const userId = req.user._id;

        // Check if lesson exists and belongs to the course
        const lesson = await Lesson.findOne({ _id: lessonId, courseId });
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found or does not belong to this course' })
            );
        }

        // Check if user is subscribed to the course
        const course = await Course.findById(courseId);
        if (!course || !course.subscriptions.includes(userId)) {
            return res.status(403).json(
                JSendResponse.fail({ message: 'You must be subscribed to this course to mark lessons as complete' })
            );
        }

        // Check if already completed
        const existingCompletion = await LessonCompletion.findOne({ user: userId, lesson: lessonId });
        if (existingCompletion) {
            return res.status(200).json(
                JSendResponse.success({ 
                    message: 'Lesson already marked as complete',
                    completion: existingCompletion
                })
            );
        }

        // Create lesson completion
        const lessonCompletion = await LessonCompletion.create({
            user: userId,
            lesson: lessonId,
            course: courseId,
            watchTime: watchTime || 0,
            completionPercentage: completionPercentage || 100
        });

        // Add to user's completed lessons
        await User.findByIdAndUpdate(userId, {
            $addToSet: { completedLessons: lessonCompletion._id }
        });

        // Check if course is now completed
        await checkAndMarkCourseComplete(userId, courseId);

        res.status(201).json(
            JSendResponse.success({ 
                message: 'Lesson marked as complete',
                completion: lessonCompletion
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get completed lessons for a course
exports.getCompletedLessons = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const completedLessons = await LessonCompletion.find({
            user: userId,
            course: courseId
        }).populate('lesson', 'title _id order');

        const lessonIds = completedLessons.map(completion => completion.lesson._id);

        res.status(200).json(
            JSendResponse.success({ 
                completedLessons: lessonIds,
                completions: completedLessons
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get user's completed courses
exports.getCompletedCourses = async (req, res) => {
    try {
        const userId = req.user._id;

        const completedCourses = await CourseCompletion.find({ user: userId })
            .populate('course', 'title description image category')
            .sort({ completedAt: -1 });

        res.status(200).json(
            JSendResponse.success({ completedCourses })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get course completion status
exports.getCourseCompletionStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // Get total lessons in course
        const totalLessons = await Lesson.countDocuments({ courseId });

        // Get completed lessons
        const completedLessons = await LessonCompletion.countDocuments({
            user: userId,
            course: courseId
        });

        // Check if course is completed
        const courseCompletion = await CourseCompletion.findOne({
            user: userId,
            course: courseId
        });

        const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        res.status(200).json(
            JSendResponse.success({
                totalLessons,
                completedLessons,
                completionPercentage: Math.round(completionPercentage),
                isCompleted: !!courseCompletion,
                courseCompletion
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Helper function to check and mark course as complete
const checkAndMarkCourseComplete = async (userId, courseId) => {
    try {
        // Get total lessons in course
        const totalLessons = await Lesson.countDocuments({ courseId });

        // Get completed lessons for this course
        const completedLessons = await LessonCompletion.countDocuments({
            user: userId,
            course: courseId
        });

        // If all lessons are completed, mark course as complete
        if (totalLessons > 0 && completedLessons >= totalLessons) {
            // Check if course is already marked as complete
            const existingCourseCompletion = await CourseCompletion.findOne({
                user: userId,
                course: courseId
            });

            if (!existingCourseCompletion) {
                // Create course completion
                const courseCompletion = await CourseCompletion.create({
                    user: userId,
                    course: courseId,
                    totalLessons,
                    completedLessons,
                    completionPercentage: 100
                });

                // Add to user's completed courses
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { completedCourses: courseCompletion._id }
                });

                console.log(`Course ${courseId} marked as complete for user ${userId}`);
                return courseCompletion;
            }
        }
        return null;
    } catch (error) {
        console.error('Error checking course completion:', error);
        return null;
    }
};

// Generate certificate for completed course
exports.generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // Check if course is completed
        const courseCompletion = await CourseCompletion.findOne({
            user: userId,
            course: courseId
        }).populate('course', 'title description').populate('user', 'firstName lastName email');

        if (!courseCompletion) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not completed yet' })
            );
        }

        // For now, return the certificate data
        // In a real implementation, you would generate a PDF certificate
        const certificateData = {
            certificateId: courseCompletion.certificateId,
            studentName: `${courseCompletion.user.firstName} ${courseCompletion.user.lastName}`,
            courseName: courseCompletion.course.title,
            completedAt: courseCompletion.completedAt,
            completionPercentage: courseCompletion.completionPercentage
        };

        res.status(200).json(
            JSendResponse.success({ 
                certificate: certificateData,
                message: 'Certificate generated successfully'
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

