const User = require('../models/User');
const Course = require('../models/Course');
import cloudinary from "../lib/cloudinary.js";

const  uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
        }
    )
    return result.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
        throw new Error("Error uploading to Cloudinary");
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({admin: true});
}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
}

export const getStats = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments({});
        const courseCount = await Course.countDocuments({});
        res.status(200).json({ userCount, courseCount });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving stats', error });
    }
}