const passport = require("passport");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Use env variable

const authController = {
    googleLogin: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: passport.authenticate("google", {
        failureRedirect: `${CLIENT_URL}/login`, // Redirect dynamically
    }),
    
    googleCallbackSuccess: (req, res) => {
        res.redirect(`${CLIENT_URL}/home`); // Redirect to frontend dashboard
    },

    logout: (req, res) => {
        req.logout(() => {
            res.redirect(CLIENT_URL); // Redirect to frontend home after logout
        });
    }
};

module.exports = authController;