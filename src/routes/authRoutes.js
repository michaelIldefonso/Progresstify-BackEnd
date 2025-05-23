// Import necessary modules and controllers
const express = require("express");
const googleAuthController = require("../controllers/googleAuthController");
const githubAuthController = require("../controllers/githubAuthController");

// Create a new router instance
const router = express.Router();

// Route to initiate Google login
router.get(
    "/google", 
    googleAuthController.googleLogin
);

// Route to handle Google callback after authentication
router.get(
    "/google/callback", 
    googleAuthController.googleCallback
);

// Route to initiate GitHub login
router.get(
    "/github", 
    githubAuthController.githubAuth
);

// Route to handle GitHub callback after authentication
router.get(
    "/github/callback", 
    githubAuthController.githubCallback
);

// Export the router module
module.exports = router;