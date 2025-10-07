const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Subscription = require('../models/Subscription');
const JSendResponse = require('../utils/StandardResponse');

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        console.log("getDashboardStats");
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        
        // Calculate active subscriptions and total revenue
        const courses = await Course.find();
        let totalRevenue = 0;
        let activeSubscriptions = 0;

        courses.forEach(course => {
            // Count subscriptions (users enrolled in each course)
            activeSubscriptions += course.subscriptions.length;
            // Calculate revenue (current price * number of subscriptions)
            totalRevenue += course.currentPrice * course.subscriptions.length;
        });

        res.status(200).json(
            JSendResponse.success({
                totalUsers,
                totalCourses,
                totalRevenue,
                activeSubscriptions
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// User Management
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.status(200).json(
            JSendResponse.success({
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                    hasPreviousPage: page > 1
                }
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'User not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ user })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'User not found' })
            );
        }

        res.status(200).json(
            JSendResponse.success({ user })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'User not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ message: 'User deleted successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Course Management
exports.getCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        const courses = await Course.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments(query);

        res.status(200).json(
            JSendResponse.success({
                courses,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                    hasPreviousPage: page > 1
                }
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getCourse = async (req, res) => {
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
            JSendResponse.error(error.message)
        );
    }
};

exports.createCourse = async (req, res) => {
    try {
        const courseData = { ...req.body };
        if (req.file) {
            courseData.image = {
                url: `/uploads/${req.file.filename}`,
                public_id: req.file.filename
            };
        }
        const course = await Course.create(courseData);
        res.status(201).json(
            JSendResponse.success({ course })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = {
                url: `/uploads/${req.file.filename}`,
                public_id: req.file.filename
            };
        }
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
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
            JSendResponse.error(error.message)
        );
    }
};

exports.updateCourseStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

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
            JSendResponse.error(error.message)
        );
    }
};

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
            JSendResponse.error(error.message)
        );
    }
};

// Lesson Management
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

        // Update course with new lesson
        await Course.findByIdAndUpdate(
            req.params.courseId,
            {
                $push: { lessons: lesson._id }
            }
        );

        // Recalculate totals using the Course model method
        await Course.recalculateTotalsById(req.params.courseId);

        res.status(201).json(
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
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Lesson not found' })
            );
        }

        // Update lesson
        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Recalculate totals using the Course model method
        await Course.recalculateTotalsById(lesson.courseId);

        res.status(200).json(
            JSendResponse.success({ lesson: updatedLesson })
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

        const courseId = lesson.courseId;

        // Delete the lesson
        await Lesson.findByIdAndDelete(req.params.id);

        // Remove lesson from course lessons array
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: { lessons: req.params.id }
            }
        );

        // Recalculate totals using the Course model method
        await Course.recalculateTotalsById(courseId);

        res.status(200).json(
            JSendResponse.success({ message: 'Lesson deleted successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Subscription Management
exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate('user', 'firstName lastName email')
            .populate('course', 'title');
        res.status(200).json(
            JSendResponse.success({ subscriptions })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('course', 'title');
        
        if (!subscription) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Subscription not found' })
            );
        }

        res.status(200).json(
            JSendResponse.success({ subscription })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Subscription not found' })
            );
        }

        res.status(200).json(
            JSendResponse.success({ subscription })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Reports
exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const courses = await Course.find(query);
        let revenue = 0;
        let subscriptionCount = 0;

        courses.forEach(course => {
            const courseRevenue = course.currentPrice * course.subscriptions.length;
            revenue += courseRevenue;
            subscriptionCount += course.subscriptions.length;
        });

        res.status(200).json(
            JSendResponse.success({ 
                revenue,
                subscriptionCount,
                averageRevenuePerSubscription: subscriptionCount > 0 ? revenue / subscriptionCount : 0
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getUserReport = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const newUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        res.status(200).json(
            JSendResponse.success({
                totalUsers,
                activeUsers,
                newUsers
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.getCourseReport = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ status: 'active' });
        const popularCourses = await Course.find()
            .sort({ enrollments: -1 })
            .limit(5)
            .select('title enrollments');

        res.status(200).json(
            JSendResponse.success({
                totalCourses,
                activeCourses,
                popularCourses
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
}; 