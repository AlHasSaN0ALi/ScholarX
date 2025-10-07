const Course = require('../models/Course');
const JSendResponse = require('../utils/StandardResponse');
const Category = require('../models/Category');
const { handleImageUpload, cloudinary } = require('../utils/cloudinaryConfig');
const { log } = require('console');

// Create a new course with image upload
exports.createCourse = async (req, res) => {
    try {
        const courseData = {
            ...req.body,
            image: req.file ? {
                url: `/uploads/${req.file.filename}`,
                public_id: req.file.filename
            } : null
        };
        const course = new Course(courseData);
        await course.save();
        res.status(201).json(
            JSendResponse.success({ course })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get all courses with pagination and category filtering
exports.getCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        // Build query based on category filter
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }

        
        const courses = await Course.find(query)
            .skip(skip)
            .limit(limit)
            // .populate('instructor', 'name email profilePicture');

        const totalCourses = await Course.countDocuments(query);
        const totalPages = Math.ceil(totalCourses / limit);

        // Add isSubscribed for each course if user is logged in
        let userId = req.user?._id?.toString();
        const coursesWithSubscription = courses.map(course => {
            let isSubscribed = false;
            if (userId && course.subscriptions && Array.isArray(course.subscriptions)) {
                isSubscribed = course.subscriptions.map(id => id.toString()).includes(userId);
            }
            return { ...course.toObject(), isSubscribed };
        });

        res.status(200).json(
            JSendResponse.success({
                courses: coursesWithSubscription,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCourses,
                    hasNextPage: page < totalPages,
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

// Get a course by ID with populated instructor
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            // .populate('instructor', 'name email profilePicture')
            // .populate('categoryId');
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

// Update a course with image upload
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

// Delete a course and its image
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }

        // Delete image from Cloudinary if exists
        if (course.image && course.image.public_id) {
            await cloudinary.uploader.destroy(course.image.public_id);
        }

        await course.remove();
        res.status(200).json(
            JSendResponse.success({ message: 'Course deleted successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
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

// Check if user is subscribed to a course
exports.checkSubscriptionStatus = async (req, res) => {
    console.log("hiiiiiiiiiii");
    try {
        
        const { userId } = req.query;
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Course not found' })
            );
        }

        if (!userId) {
            return res.status(400).json(
                JSendResponse.fail({ message: 'User ID is required' })
            );
        }

        // Check if user is blocked
        const User = require('../models/User');
        const user = await User.findById(userId);
        console.log(user);
        // if (user && user.isBlocked) {
        //     console.log("blockedddddd");
            
        //     return res.status(403).json(
        //         JSendResponse.fail({ 
        //             message: 'Your account has been blocked. Please contact support for assistance.',
        //             isBlocked: true,
        //             blockReason: user.blockReason,
        //             blockedAt: user.blockedAt
        //         })
        //     );
        // }

        // Check if user ID exists in course subscriptions array
        const isSubscribed = course.subscriptions.includes(userId);

        console.log("isSubscribed", isSubscribed);
        
        res.status(200).json(
            JSendResponse.success({ 
                isSubscribed,
                courseId: course._id,
                userId: userId
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get courses by category with populated instructor
exports.getCoursesByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const category = await Category.findOne({ name: categoryName });
        
        if (!category) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Category not found' })
            );
        }

        const courses = await Course.find({ categoryId: category._id })
            .skip(skip)
            .limit(limit)
            .populate('instructor', 'name email profilePicture')
            .populate('categoryId');

        const totalCourses = await Course.countDocuments({ categoryId: category._id });
        const totalPages = Math.ceil(totalCourses / limit);

        res.status(200).json(
            JSendResponse.success({
                courses,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCourses,
                    hasNextPage: page < totalPages,
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

// Get featured courses with pagination
exports.getFeaturedCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const courses = await Course.find({ category: 'Featured' })
            .skip(skip)
            .limit(limit)
            // .populate('instructor', 'name email profilePicture');

        const totalCourses = await Course.countDocuments({ category: 'Featured' });
        const totalPages = Math.ceil(totalCourses / limit);

        res.status(200).json(
            JSendResponse.success({
                courses,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCourses,
                    hasNextPage: page < totalPages,
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

// Get ScholarX courses with pagination
exports.getScholarXCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const courses = await Course.find({ category: 'ScholarX' })
            .skip(skip)
            .limit(limit)
            // .populate('instructor', 'name email profilePicture');

        const totalCourses = await Course.countDocuments({ category: 'ScholarX' });
        const totalPages = Math.ceil(totalCourses / limit);

        res.status(200).json(
            JSendResponse.success({
                courses,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCourses,
                    hasNextPage: page < totalPages,
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

// Search courses by title with pagination
exports.searchCourses = async (req, res) => {
    try {
        const { title } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;
console.log(title);

        // if (!title) {
        //     return res.status(400).json(
        //         JSendResponse.fail({ message: 'Search title is required' })
        //     );
        // }

        const query = {
            title: { $regex: title, $options: 'i' } // Case-insensitive search
        };

        const courses = await Course.find(query)
            .skip(skip)
            .limit(limit)
            // .populate('instructor', 'name email profilePicture')
            .lean();

        const totalCourses = await Course.countDocuments(query);
        const totalPages = Math.ceil(totalCourses / limit);

        res.status(200).json(
            JSendResponse.success({
                courses,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCourses,
                    hasNextPage: page < totalPages,
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

