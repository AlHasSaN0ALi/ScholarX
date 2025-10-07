const getAmbassadorConfirmationEmail = (application, user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3399CC; text-align: center;">Thank you for applying to become a ScholarX Ambassador!</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #333;">Application Details</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><strong>Application ID:</strong> ${application._id}</li>
                <li style="margin: 10px 0;"><strong>Status:</strong> Pending Review</li>
                <li style="margin: 10px 0;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
        </div>

        <p style="color: #666;">We have received your application and will review it shortly. Our team will carefully evaluate your:</p>
        <ul style="color: #666;">
            <li>Motivation and goals</li>
            <li>Promotion plan</li>
            <li>Relevant experience</li>
            <li>Answers to our questions</li>
        </ul>

        <p style="color: #666;">We will notify you via email once your application has been reviewed.</p>

        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
    </div>
`;

const getAmbassadorAdminNotification = (application, user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3399CC; text-align: center;">New Ambassador Application Received</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #333;">Applicant Information</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
                <li style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</li>
                <li style="margin: 10px 0;"><strong>Application ID:</strong> ${application._id}</li>
                <li style="margin: 10px 0;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
        </div>

        <p style="color: #666;">Please review this application in the admin dashboard.</p>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.ADMIN_DASHBOARD_URL}/applications/${application._id}" 
               style="display: inline-block; padding: 10px 20px; background-color: #3399CC; color: white; text-decoration: none; border-radius: 5px;">
                View Application
            </a>
        </div>
    </div>
`;

const getMentorshipConfirmationEmail = (request, user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3399CC; text-align: center;">Thank you for requesting a mentor!</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #333;">Request Details</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><strong>Request ID:</strong> ${request._id}</li>
                <li style="margin: 10px 0;"><strong>Status:</strong> Pending</li>
                <li style="margin: 10px 0;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
        </div>

        <p style="color: #666;">We have received your mentorship request and will match you with a suitable mentor soon. Our team will consider:</p>
        <ul style="color: #666;">
            <li>Your goals and objectives</li>
            <li>Area of interest</li>
            <li>Your expectations</li>
            <li>Your availability</li>
        </ul>

        <p style="color: #666;">We will notify you via email once we find a suitable mentor for you.</p>

        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
    </div>
`;

const getMentorshipAdminNotification = (request, user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3399CC; text-align: center;">New Mentorship Request Received</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #333;">Student Information</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
                <li style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</li>
                <li style="margin: 10px 0;"><strong>Request ID:</strong> ${request._id}</li>
                <li style="margin: 10px 0;"><strong>Area of Interest:</strong> ${request.applicationData.area}</li>
                <li style="margin: 10px 0;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
        </div>

        <p style="color: #666;">Please review this request in the admin dashboard.</p>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.ADMIN_DASHBOARD_URL}/mentorship/${request._id}" 
               style="display: inline-block; padding: 10px 20px; background-color: #3399CC; color: white; text-decoration: none; border-radius: 5px;">
                View Request
            </a>
        </div>
    </div>
`;

module.exports = {
    getAmbassadorConfirmationEmail,
    getAmbassadorAdminNotification,
    getMentorshipConfirmationEmail,
    getMentorshipAdminNotification
}; 

// Contact form email (admin notification)
const getContactFormEmail = ({ firstName, lastName, email, message }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3399CC; text-align: center;">New Contact Form Message</h1>
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Sender Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        </div>
        <div style="padding: 16px; border: 1px solid #e5e5e5; border-radius: 6px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <pre style="white-space: pre-wrap; font-family: inherit;">${message}</pre>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px;">This notification was sent by ScholarX.</p>
    </div>
`;

// Open course access request (admin notification)
const getOpenCourseRequestEmail = ({ firstName, lastName, email, courseTitle, courseId }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3399CC; text-align: center;">Course Access Request</h1>
        <p style="color: #555;">A user requested manual access while payments are offline.</p>
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">User Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        </div>
        <div style="padding: 16px; border: 1px solid #e5e5e5; border-radius: 6px;">
            <h3 style="color: #333; margin-top: 0;">Course</h3>
            <p style="margin: 8px 0;"><strong>Title:</strong> ${courseTitle}</p>
            ${courseId ? `<p style="margin: 8px 0;"><strong>Course ID:</strong> ${courseId}</p>` : ''}
        </div>
        <p style="margin-top: 16px; color: #666;">Suggested next steps: verify the user and grant access from the Admin Dashboard.</p>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px;">This notification was sent by ScholarX.</p>
    </div>
`;

module.exports.getContactFormEmail = getContactFormEmail;
module.exports.getOpenCourseRequestEmail = getOpenCourseRequestEmail;