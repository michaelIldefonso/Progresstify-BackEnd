// Importing the passport module for authentication
const passport = require("passport");

module.exports = {
    // Middleware to initiate Google OAuth login for admin users
    googleLogin: passport.authenticate("google-admin", { scope: ["profile", "email"] }),

    // Callback handler for Google OAuth
    handleGoogleCallback: (req, res) => {
        try {
            // Extracting access and refresh tokens from the authenticated user
            const { accessToken, refreshToken } = req.user.generateJwt();

            // Redirecting the admin user to the home page with tokens as query parameters
            res.redirect(`${process.env.ADMIN_URL}/home?token=${accessToken}&refreshToken=${refreshToken}`);
        } catch (err) {
            // Logging the error and sending a 500 response in case of failure
            console.error("OAuth Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
