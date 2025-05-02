import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/api';
import Swal from 'sweetalert2';
import "./Signup.css";

const signupSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
});

const Signup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await authService.register(values);
            if (response.status === 'success') {
                // Show success message
                await Swal.fire({
                    title: 'Success!',
                    text: 'Registration successful! Redirecting to login...',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'animated fadeInDown'
                    }
                });
                
                navigate('/login');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.data?.message || 'An error occurred during registration');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-content">
                <div className="image">
                    <div className="imageContainer">
                        <div className="socialProof"></div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="form-title">Create Your Account</h2>
                    {error && <div className="error-message">{error}</div>}
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            phoneNumber: '',
                        }}
                        validationSchema={signupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="signup-form">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <Field
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="firstName" component="small" className="error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <Field
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="lastName" component="small" className="error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="email" component="small" className="error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <Field
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="phoneNumber" component="small" className="error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Field
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="password" component="small" className="error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <Field
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="confirmPassword" component="small" className="error" />
                                </div>

                                <button 
                                    type="submit" 
                                    className="signup-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                </button>

                                <div className="linkk">
                                    Have an account? <Link className="login-link" to="/login">Login</Link>
                                </div>

                                <div className="divider">
                                    <span>Or Sign Up with</span>
                                </div>

                                <button 
                                    type="button" 
                                    className="google-signup"
                                    onClick={() => authService.initiateGoogleLogin()}
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

export default Signup;

