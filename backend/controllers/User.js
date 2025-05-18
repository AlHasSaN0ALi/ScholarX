const User = require('../models/User');
const JSendResponse = require('../utils/StandardResponse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { handleImageUpload } = require('../utils/cloudinaryConfig');
const { sendVerificationEmail,sendPasswordResetEmail } = require('../utils/emailService');
const { validateEmail } = require('../utils/emailValidator');

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
        
        // Validate email using Abstract API
        const emailValidation = await validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json(
                JSendResponse.fail({ message: emailValidation.message })
            );
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(
                JSendResponse.fail({ message: 'User already exists' })
            );
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const user = await User.create({
            ...req.body,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
        });

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken);
        console.log("fffff");
        if (!emailResult.success) {
            console.log("fffff");
            
            // If email sending fails, delete the user and return error
            await User.findByIdAndDelete(user._id);
            return res.status(500).json(
                JSendResponse.fail({ message: 'Failed to send verification email. Please check if the email address exists.' })
            );
        }

        res.status(201).json(
            JSendResponse.success({
                message: 'Registration successful. Please check your email to verify your account.',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    
    try {
        console.log("abooooooo");
        const { token } = req.query;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json(
                JSendResponse.fail({ message: 'Invalid or expired verification token' })
            );
        }

        user.isEmailVerified = true;
        // user.emailVerificationToken = undefined;
        // user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json(
            JSendResponse.success({ message: 'Email verified successfully' })
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
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Invalid email or password' })
            );
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Please verify your email before logging in' })
            );
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Invalid email or password' })
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
        console.log("uuuu");
        
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'No user found with that email address' })
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

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Send email
        const emailResult = await sendPasswordResetEmail(
            email,
            resetUrl,
            
        );

        if (!emailResult.success) {
            return res.status(500).json(
                JSendResponse.fail({ message: 'Email could not be sent' })
            );
        }

        res.status(200).json(
            JSendResponse.success({
                message: 'Password reset email sent. Please check your email.'
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
