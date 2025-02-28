const passport = require("passport");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Use env variable

const authController = {
    googleLogin: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: passport.authenticate("google", {
        failureRedirect: "/login", // Redirect dynamically
    }),
    
    googleCallbackSuccess: (req, res) => {
        res.redirect("/dashboard"); // Redirect to dashboard view
    },

    logout: (req, res) => {
        req.logout(() => {
            res.redirect("/"); // Redirect to home after logout
        });
    }
};

module.exports = authController;