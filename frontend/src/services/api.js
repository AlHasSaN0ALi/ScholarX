import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL ;
console.log(import.meta.env.VITE_API_URL);

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

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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


    verifyEmail: async (token) => {
        return await axios.get(`${API_URL}/users/verify-email?token=${token}`);
    }
};

export const programService = {
    // Ambassador Program
    submitAmbassadorApplication: async (data) => {
        const response = await api.post('/programs/ambassador/apply', data);
        return response.data;
    },

    // Mentorship Program
    submitMentorshipRequest: async (data) => {
        const response = await api.post('/programs/mentorship/request', data);
        return response.data;
    },

    // Get application status
    getApplicationStatus: async (id) => {
        const response = await api.get(`/programs/status/${id}`);
        return response.data;
    },

    // Get all applications for current user
    getMyApplications: async () => {
        const response = await api.get('/programs/my-applications');
        return response.data;
    }
};

export default api; 