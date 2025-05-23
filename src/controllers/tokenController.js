// Importing utility functions for token verification and generation
const { verifyToken, generateAccessToken } = require("../utils/tokenUtils");

// Controller function to refresh the access token
exports.refreshAccessToken = async (req, res) => {
    // Extracting the refresh token from the request body
    const { refreshToken } = req.body;

    // If no refresh token is provided, return a 400 response
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        // Verifying the refresh token using the secret key
        const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        // If the token is invalid, return a 401 response
        if (!payload) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generating a new access token using the payload data
        const newAccessToken = generateAccessToken({
            id: payload.id,       // User ID
            email: payload.email, // User email
            role_id: payload.role_id // User role ID
        });

        // Responding with the new access token in JSON format
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        // Logging the error and sending a 500 response in case of failure
        console.error("Error refreshing token:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
