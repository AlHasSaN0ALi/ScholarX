const axios = require('axios');

const validateEmail = async (email) => {
    try {
        const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`);
        
        // Check if email is valid and deliverable
        if (response.data.is_valid_format.value && 
            response.data.is_mx_found.value && 
            response.data.is_smtp_valid.value) {
            return {
                isValid: true,
                message: 'Email is valid'
            };
        }

        return {
            isValid: false,
            message: 'Invalid or non-existent email address'
        };
    } catch (error) {
        console.error('Email validation error:', error);
        return {
            isValid: false,
            message: 'Error validating email'
        };
    }
};

module.exports = { validateEmail }; 