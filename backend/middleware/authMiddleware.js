// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Verify if the user is logged in
const protect = (req, res, next) => {
    let token;

    // Check if token is in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route. No token provided.' });
    }

    try {
        // Decode the token using your secret
        const decoded = jwt.verify(token, process.env.JWToken);

        // Attach the user info 
        req.user = decoded;
        next(); // Pass the request to the next function
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized. Token is invalid or expired.' });
    }
};

// Verify if the user has the required role 
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route.`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };