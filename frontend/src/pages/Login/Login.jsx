import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address.";
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
          <h2 className="form-title">Login to Your Account</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group1">
              <label htmlFor="email">Email address</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="form-group1">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <small className="error">{errors.password}</small>}
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <span>Remember me</span>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot your password?
              </Link>
            </div>

            <button type="submit" className="signup-button">Sign In</button>

            <div className="divider">
              <span>Or Sign up with</span>
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

export default Login;
