import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
 const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      } else if (!/^[a-zA-Z]+(?: [a-zA-Z]+)+$/.test(formData.fullName.trim())) {
        newErrors.fullName = "Enter your full name (first and last).";
      }
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
    <div className="signup-header">
      <img src="/ScholarX-Logo.png" alt="Logo" className="logo-img" />
    </div>
      <div className="signup-content">
        <div className="image">
          <div className="imageContainer">
            <div className="socialProof"></div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-title">Create Your Account</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <small className="error">{errors.fullName}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <small className="error">{errors.password}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
            </div>

            <button type="submit" className="signup-button">Sign UP</button>

            <div className="login-link">
              Have an account? <Link to="/login">Login</Link>
            </div>

            <div className="divider">
              <span>Or Sign Up with</span>
            </div>

            <button type="button" className="google-signup">
              <img src="/google.png" alt="Google" className="google-icon" />
              Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

