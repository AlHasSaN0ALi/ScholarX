const User = require('../models/User');
const JSendResponse = require('../utils/StandardResponse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { handleImageUpload } = require('../utils/cloudinaryConfig');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(
                JSendResponse.fail({ message: 'User already exists' })
            );
        }

        const user = await User.create(req.body);

        res.status(201).json(
            JSendResponse.success({
                user
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Invalid email' })
            );
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Invalid pasword' })
            );
        }

        const token = generateToken(user._id);

        res.status(200).json(
            JSendResponse.success({
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                },
                token
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
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

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        handleImageUpload(req, res, async (err) => {
            if (err) {
                return res.status(400).json(
                    JSendResponse.fail({ message: 'Image upload failed' })
                );
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path;
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
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
        });
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Current password is incorrect' })
            );
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json(
            JSendResponse.success({ message: 'Password updated successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'User not found' })
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // TODO: Send reset password email
        // For now, we'll just return the token
        res.status(200).json(
            JSendResponse.success({
                message: 'Password reset token generated',
                resetToken
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json(
                JSendResponse.fail({ message: 'Invalid or expired token' })
            );
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json(
            JSendResponse.success({ message: 'Password reset successful' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'User not found' })
            );
        }
        res.status(200).json(
            JSendResponse.success({ message: 'Account deleted successfully' })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};
