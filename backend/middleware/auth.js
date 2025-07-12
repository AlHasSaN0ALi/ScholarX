const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JSendResponse = require('../utils/StandardResponse');

exports.protect = async (req, res, next) => {
    console.log("hhh");
    
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // console.log(token);

        if (!token) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Not authorized to access this route' })
            );
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            // console.log(req.user);
            
            next();
        } catch (err) {
            return res.status(401).json(
                JSendResponse.fail({ message: 'Not authorized to access this route' })
            );
        }
    } catch (error) {
        res.status(500).json(
            JSendResponse.error(error.message)
        );
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(
                JSendResponse.fail({ 
                    message: `User role ${req.user.role} is not authorized to access this route`
                })
            );
        }
        next();
    };
};

// Optional authentication middleware: attaches req.user if token is present, but does not block unauthenticated requests
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(); // No token, proceed as guest
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (err) {
            // Invalid token, proceed as guest
        }
        return next();
    } catch (error) {
        return next();
    }
}; 