import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckbox";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const containerVariants = {
        hidden: { x: "-100%" },
        visible: { 
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
                staggerChildren: 0.1
            }
        },
        exit: { 
            x: "100%",
            transition: {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const formVariants = {
        hidden: { x: "100%" },
        visible: { 
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: { 
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row rounded-5 p-3 shadow box-area login-container" style={{ width: "100%", maxWidth: "1000px" }}>
                {/* Left Box (Image) */}
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ backgroundColor: "#3399cc" }}>
                    <div className="featured-image">
                        <img 
                            src="/ScholarX-Logo-Icon-White-Blue-BG_ScholarX.svg" 
                            className="img-fluid"
                            style={{ width: "80%" }} 
                            alt="Scholar-x Logo" 
                        />
                    </div>
                </div>

                {/* Right Box (Form) */}
                <div className="col-md-6 right-box">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">Welcome to ScholarX</h2>
                        <p>Access your scholarship portal.</p>
                    </div>
                    <form className="d-flex flex-column align-items-center">
                        <div className="input-group mb-3 w-100">
                            <input
                                type="email"
                                className="form-control form-control-lg bg-light fs-6"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="input-group mb-3 w-100">
                            <input
                                type="password"
                                className="form-control form-control-lg bg-light fs-6"
                                placeholder="Password"
                            />
                        </div>
                        <div className="form-check mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="rememberMe"
                                style={{ marginRight: '4px' }}
                            />
                            <label className="form-check-label" htmlFor="rememberMe" style={{ margin: '0' }}>
                                Remember me
                            </label>
                        </div>
                        <div className="input-group mb-3 w-100">
                            <button type="submit" className="btn btn-lg w-100 fs-6 loginbtn fw-normal">
                                Login
                            </button>
                        </div>
                        <div className="input-group mb-3 w-100">
                            <button className="btn btn-lg btn-light w-100 fs-6">
                                <img 
                                    src="/google.png"  
                                    style={{ width: "20px" }} 
                                    className="me-2" 
                                    alt="Google Logo"
                                />
                                <small>Login with Google</small>
                            </button>
                        </div>
                        <div className="row text-center">
                            <small>
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-primary">
                                    Sign Up
                                </Link>
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;