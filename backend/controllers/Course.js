const Course = require('../models/Course');
const JSendResponse = require('../utils/StandardResponse');
const Category = require('../models/Category');
const { handleImageUpload } = require('../utils/cloudinaryConfig');

// Create a new course with image upload
exports.createCourse = async (req, res) => {
    console.log("hiiiiiiii");
    try {
        
        handleImageUpload(req, res, async (err) => {
            if (err) {
                return res.status(400).json(
                    JSendResponse.fail({ message: 'Image upload failed' })
                );
            }

            const courseData = {
                ...req.body,
                image: req.file ? {
                    url: req.file.path,
                    public_id: req.file.filename
                } : null
            };
console.log(courseData);

            const course = new Course(courseData);
            await course.save();
            res.status(201).json(
                JSendResponse.success({ course })
            );
        });
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get all courses with pagination (3 courses per page)
exports.getCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const courses = await Course.find()
            .skip(skip)
            .limit(limit)
            .populate('categoryId');

        const totalCourses = await Course.countDocuments();
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

// Get a course by ID with populated instructor
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email profilePicture')
            .populate('categoryId');
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
        handleImageUpload(req, res, async (err) => {
            if (err) {
                return res.status(400).json(
                    JSendResponse.fail({ message: 'Image upload failed' })
                );
            }

            const updateData = { ...req.body };
            
            // If new image is uploaded, add it to update data
            if (req.file) {
                updateData.image = {
                    url: req.file.path,
                    public_id: req.file.filename
                };

                // Delete old image from Cloudinary if exists
                const oldCourse = await Course.findById(req.params.id);
                if (oldCourse.image && oldCourse.image.public_id) {
                    await cloudinary.uploader.destroy(oldCourse.image.public_id);
                }
            }

            const course = await Course.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            ).populate('instructor', 'name email profilePicture')
             .populate('categoryId');

            if (!course) {
                return res.status(404).json(
                    JSendResponse.fail({ message: 'Course not found' })
                );
            }
            res.status(200).json(
                JSendResponse.success({ course })
            );
        });
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
    console.log("jhhhhhhhhh");
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        // Find the Featured category
        const featuredCategory = await Category.findOne({ name: 'Featured' });
        
        if (!featuredCategory) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Featured category not found' })
            );
        }

        // Find featured courses with pagination
        const courses = await Course.find({ categoryId: featuredCategory._id })
            .skip(skip)
            .limit(limit)
            .populate('categoryId');

        const totalCourses = await Course.countDocuments({ categoryId: featuredCategory._id });
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

        // Find the ScholarX category
        const scholarXCategory = await Category.findOne({ name: 'ScholarX' });
        
        if (!scholarXCategory) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'ScholarX category not found' })
            );
        }

        // Find ScholarX courses with pagination
        const courses = await Course.find({ categoryId: scholarXCategory._id })
            .skip(skip)
            .limit(limit)
            .populate('categoryId');

        const totalCourses = await Course.countDocuments({ categoryId: scholarXCategory._id });
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

