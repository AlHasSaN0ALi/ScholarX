import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./forget.css";

const ForgetPassword = () => {
    return (
        <div className="forget-page-container">
            <div className="logo-container">
                <Link to="/">
                    <img 
                        src="/ScholarX-Logo-Icon-White-Blue-BG_ScholarX.svg" 
                        className="scholar-logo"
                        alt="ScholarX Logo" 
                    />
                    <span className="logo-text">ScholarX</span>
                </Link>
            </div>
            
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <h1 className="page-title">Forgot Your Password?</h1>
                <p className="page-subtitle">No worries! Enter your email and we'll send you a link to reset it.</p>
                
                <div className="forgot-card">
                    <h5 className="text-center mb-4">Enter your email</h5>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                    />
                    <div className="d-grid">
                        <button type="submit" className="btn reset-btn">
                            Send Reset Link
                        </button>
                    </div>
                    <div className="mt-3 text-center">
                        Remember your password? <Link to="/login" className="login-link">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
