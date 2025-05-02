import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/api';
import Swal from 'sweetalert2';
import './Login.css';

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await authService.login(values);
            if (response.status === 'success') {
                // Show success message
                await Swal.fire({
                    title: 'Success!',
                    text: 'Login successful!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'animated fadeInDown'
                    }
                });
                
                // Dispatch event and navigate
                window.dispatchEvent(new Event('authStateChanged'));
                navigate('/');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.data?.message || 'An error occurred during login');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        authService.initiateGoogleLogin();
    };

    return (
        <div className="login-container ">
            {/* <div className="login-header">
                <img src="/ScholarX-Logo.png" alt="Logo" className="logo-img" />
            </div> */}
            <div className="login-content">
                <div className="image">
                    <div className="imageContainer">
                        <div className="socialProof"></div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="form-title">Login to Your Account</h2>
                    {error && <div className="error-message">{error}</div>}
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="login-form">
                                <div className="form-group1">
                                    <label htmlFor="email">Email address</label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="email" component="small" className="error" />
                                </div>

                                <div className="form-group1">
                                    <label htmlFor="password">Password</label>
                                    <Field
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="password" component="small" className="error" />
                                </div>

                                <div className="form-options">
                                    <div className="remember-me">
                                        <Field type="checkbox" id="remember" name="remember" />
                                        <span>Remember me</span>
                                    </div>
                                    <Link to="/forgot-password" className="forgot-password">
                                        Forgot your password?
                                    </Link>
                                </div>

                                <button 
                                    type="submit" 
                                    className="login-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                                </button>
                                
                                <div className="signup-link">
                                    Don't have an account? <Link to="/signup">Sign up</Link>
                                </div>

                                <div className="divider">
                                    <span>Or Sign up with</span>
                                </div>

                                <button 
                                    type="button" 
                                    className="google-signup"
                                    onClick={handleGoogleLogin}
                                >
                                    <img src="/google.png" alt="Google" className="google-icon" />
                                    Continue with Google
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
