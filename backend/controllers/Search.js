const Course = require('../models/Course');
const Category = require('../models/Category');
const mongoose = require('mongoose');

exports.searchCourses = async (req, res) => {
    console.log('Reached searchCourses endpoint');
    try {
        const { searchTerm } = req.query;
        console.log('Search term:', searchTerm);

        if (!searchTerm) {
            console.log('No search term provided');
            return res.status(400).json({ message: 'مطلوب كلمة بحث' });
        }

        const cleanSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(cleanSearchTerm, 'i');
        console.log('Regex created:', cleanSearchTerm);

        // تحقق من اتصال MongoDB
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB not connected');
        }

        console.log('Querying courses...');
        let courses = await Course.find({
            title: { $regex: regex }
        })
            .populate({
                path: 'categoryId',
                select: 'name',
                match: { _id: { $exists: true } }
            })
            .lean()
            .catch(err => {
                console.error('Error querying courses:', err);
                throw err;
            });

        console.log('Courses found by title:', courses);

        // فلتر الكورسات اللي categoryId بتاعها null
        courses = courses.filter(course => course.categoryId);
        console.log('Filtered courses:', courses);

        console.log('Querying categories...');
        const categories = await Category.find({
            name: { $regex: regex }
        })
            .lean()
            .catch(err => {
                console.error('Error querying categories:', err);
                throw err;
            });
        console.log('Categories found:', categories);

        if (categories.length > 0) {
            console.log('Querying courses by category...');
            const categoryCourses = await Course.find({
                categoryId: { $in: categories.map(cat => cat._id) }
            })
                .populate({
                    path: 'categoryId',
                    select: 'name',
                    match: { _id: { $exists: true } }
                })
                .lean()
                .catch(err => {
                    console.error('Error querying category courses:', err);
                    throw err;
                });

            const validCategoryCourses = categoryCourses.filter(course => course.categoryId);
            console.log('Courses by category:', validCategoryCourses);

            courses = [...courses, ...validCategoryCourses].filter(
                (course, index, self) =>
                    index === self.findIndex(c => c._id.toString() === course._id.toString())
            );
            console.log('Merged courses:', courses);
        }

        if (courses.length === 0) {
            console.log('No courses found');
            return res.status(404).json({ message: 'مفيش كورسات مطابقة لبحثك' });
        }

        console.log('Sending response');
        res.status(200).json({
            message: 'نتايج البحث',
            data: courses
        });
    } catch (error) {
        console.error('Search error:', error.message, error.stack);
        res.status(500).json({ message: 'فيه مشكلة في السيرفر، جرب تاني', error: error.message });
    }
};