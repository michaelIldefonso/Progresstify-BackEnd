const passport = require("passport");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Use env variable

const authController = {
    logout: (req, res) => {
        req.logout(() => {
            res.redirect("/"); // Redirect to home after logout
        });
    },
};

module.exports = authController;