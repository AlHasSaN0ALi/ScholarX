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

module.exports = {
    sendVerificationEmail,
    sendEmail
}; 