const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async ({ email, subject, html }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
            <h1>Welcome to ScholarX!</h1>
            <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #3399CC;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            ">Verify Email Address</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

const sendPasswordResetEmail = async (email, resetUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #3399CC;">Password Reset Request</h1>
                <p>You are receiving this email because you (or someone else) has requested to reset your password for your ScholarX account.</p>
                <p>Please click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #3399CC;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    ">Reset Password</a>
                </div>
                <p style="color: #666; font-size: 14px;">This link will expire in 10 minutes.</p>
                <p style="color: #666; font-size: 14px;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
                <p style="color: #666; font-size: 14px;">For security reasons, this email was sent to ${email}.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Password reset email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendVerificationEmail,
    sendEmail,
    sendPasswordResetEmail
}; 