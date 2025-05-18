const Program = require('../models/Program');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const {
    getAmbassadorConfirmationEmail,
    getAmbassadorAdminNotification,
    getMentorshipConfirmationEmail,
    getMentorshipAdminNotification
} = require('../utils/emailTemplates');
const JSendResponse = require('../utils/StandardResponse');

// Submit Ambassador Application
exports.submitAmbassadorApplication = async (req, res) => {
    try {
        const { motivation, promotionPlan, experience, questions } = req.body;
        const userId = req.user.id;

        const application = await Program.create({
            type: 'ambassador',
            userId,
            status: 'pending',
            applicationData: {
                motivation,
                promotionPlan,
                experience,
                questions
            }
        });

        // Send confirmation email to user
        const user = await User.findById(userId);
        await sendEmail({
            email: user.email,
            subject: 'ScholarX Ambassador Application Received',
            html: getAmbassadorConfirmationEmail(application, user)
        });

        // Send notification to admin
        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: 'New Ambassador Application',
            html: getAmbassadorAdminNotification(application, user)
        });

        res.status(201).json(
            JSendResponse.success({
                message: 'Application submitted successfully',
                application
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Submit Mentorship Request
exports.submitMentorshipRequest = async (req, res) => {
    try {
        const { goal, area, expectations, availability } = req.body;
        const userId = req.user.id;

        const request = await Program.create({
            type: 'mentorship',
            userId,
            status: 'pending',
            applicationData: {
                goal,
                area,
                expectations,
                availability
            }
        });

        // Send confirmation email to user
        const user = await User.findById(userId);
        await sendEmail({
            email: user.email,
            subject: 'ScholarX Mentorship Request Received',
            html: getMentorshipConfirmationEmail(request, user)
        });

        // Send notification to admin
        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: 'New Mentorship Request',
            html: getMentorshipAdminNotification(request, user)
        });

        res.status(201).json(
            JSendResponse.success({
                message: 'Mentorship request submitted successfully',
                request
            })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get Application Status
exports.getApplicationStatus = async (req, res) => {
    try {
        const application = await Program.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json(
                JSendResponse.fail({ message: 'Application not found' })
            );
        }

        // Check if user owns this application
        if (application.userId.toString() !== req.user.id) {
            return res.status(403).json(
                JSendResponse.fail({ message: 'Not authorized to view this application' })
            );
        }

        res.status(200).json(
            JSendResponse.success({ application })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

// Get All Applications for User
exports.getApplicationsByUser = async (req, res) => {
    try {
        const applications = await Program.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json(
            JSendResponse.success({ applications })
        );
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
}; 