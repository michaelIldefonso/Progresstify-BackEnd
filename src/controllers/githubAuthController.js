// Importing the passport module for authentication
const passport = require("passport");

const githubAuthController = {
    // Middleware to initiate GitHub OAuth login
    githubAuth: passport.authenticate("github", { scope: ["user:email"] }),

    // Callback handler for GitHub OAuth
    githubCallback: (req, res) => {
        // Authenticating the user using the GitHub strategy
        passport.authenticate("github", (err, user) => {
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

// Exporting the GitHub authentication controller
module.exports = githubAuthController;
