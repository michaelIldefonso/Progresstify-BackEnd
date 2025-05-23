// Import necessary modules and middleware
const express = require("express");
const { getData } = require("../controllers/dataController");
const ensureAuthenticated = require("../middleware/authMiddleware");
const updateLastActive = require("../middleware/updateLastActiveMiddleware");

// Create a new router instance
const router = express.Router();

// Route for fetching user data
router.get(
    "/", 
    ensureAuthenticated, 
    getData, 
    updateLastActive
); // Middleware ensures authentication and updates last active status

// Export the router module
module.exports = router;
