// Import necessary modules and middleware
const express = require("express");
const passport = require("passport");
const checkAdminModerator = require("../middleware/checkAdminModerator");
const { handleGoogleCallback, googleLogin } = require("../controllers/adminGoogleAuthController");

// Create a new router instance
const router = express.Router();

// Route to initiate Google login for AdminApp
router.get("/google", googleLogin);

// Route to handle Google callback after authentication
router.get(
    "/google/callback",
    passport.authenticate("google-admin", { session: false, failureRedirect: "/" }), // Authenticate using Google strategy for admin
    checkAdminModerator, // Middleware to ensure the user is an admin or moderator
    handleGoogleCallback // Controller to handle the callback logic
);

// Export the router module
module.exports = router;
