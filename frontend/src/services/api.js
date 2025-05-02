import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        if (response.data.status === 'success') {
            // Set token in cookie with 7 days expiry
            Cookies.set('token', response.data.data.token, { expires: 7 });
            Cookies.set('user', JSON.stringify(response.data.data.user), { expires: 7 });
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        if (response.data.status === 'success') {
            // Set token in cookie with 7 days expiry
            Cookies.set('token', response.data.data.token, { expires: 7 });
            Cookies.set('user', JSON.stringify(response.data.data.user), { expires: 7 });
        }
        return response.data;
    },

    // Google authentication
    initiateGoogleLogin: () => {
        window.location.href = `${API_URL}/users/google`;
    },

    handleGoogleCallback: async (token) => {
        try {
            if (token) {
                Cookies.set('token', token, { expires: 7 });
                // Fetch user data
            
            }
        } catch (error) {
            console.error('Error handling Google callback:', error);
            throw error;
        }
    },

    logout: () => {
        Cookies.remove('token');
        Cookies.remove('user');
    },

    getCurrentUser: () => {
        const user = Cookies.get('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!Cookies.get('token');
    },

    createPayment: async (courseId) => {
        try {
            const response = await axios.post(
                `${API_URL}/payments/create/${courseId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Mock API methods for modals
    submitAmbassadorApplication: async (formData) => {
        console.log('Ambassador application submitted:', formData);
        // Mock success response
        return { status: 'success', message: 'Application submitted successfully' };
    },

    requestMentorship: async (formData) => {
        console.log('Mentorship request submitted:', formData);
        // Mock success response
        return { status: 'success', message: 'Request submitted successfully' };
    },

    subscribeToPodcast: async (email) => {
        console.log('Podcast subscription:', email);
        // Mock success response
        return { status: 'success', message: 'Subscribed to podcast successfully' };
    }
};

export default api; 