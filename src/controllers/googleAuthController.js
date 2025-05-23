// Importing the passport module for authentication
const passport = require("passport");

const googleAuthController = {
    // Middleware to initiate Google OAuth login
    googleLogin: passport.authenticate("google", { scope: ["profile", "email"] }),

    // Callback handler for Google OAuth
    googleCallback: (req, res) => {
        // Authenticating the user using the Google strategy
        passport.authenticate("google", (err, user) => {
            // If an error occurs or the user is not authenticated, return a 401 response
            if (err || !user) {
                return res.status(401).json({ message: "Authentication failed" });
            }

            // Extracting access and refresh tokens from the authenticated user
            const { accessToken, refreshToken } = user.generateJwt();

            // Redirecting the user to the client application with tokens as query parameters
            res.redirect(`${process.env.CLIENT_URL}/workspace?token=${accessToken}&refreshToken=${refreshToken}`);
        })(req, res);
    },
};

// Exporting the Google authentication controller
module.exports = googleAuthController;
