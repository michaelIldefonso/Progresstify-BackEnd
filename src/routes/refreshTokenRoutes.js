// Import necessary modules and controllers
const express = require("express");
const { refreshAccessToken } = require("../controllers/tokenController");

// Create a new router instance
const router = express.Router();

// Route to refresh access token
router.post(
    "/refresh-token", 
    refreshAccessToken
); // Controller handles token refresh logic

// Export the router module
module.exports = router;
