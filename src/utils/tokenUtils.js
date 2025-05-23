// Import the jsonwebtoken library for handling JWT operations
const jwt = require("jsonwebtoken");

// Function to generate an access token with a 1-hour expiration time
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Updated expiration time
};

// Function to generate a refresh token with a 15-day expiration time
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "15d" });
};

// Function to verify a token using a specified secret
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret); // Verify the token and return the decoded payload
    } catch (err) {
        console.error("Token verification failed:", err.message); // Log error if verification fails
        return null; // Return null if the token is invalid
    }
};

// Export the utility functions for use in other modules
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
};
