const express = require("express");
const router = express.Router();
const { getData } = require("../controllers/dataController");
const ensureAuthenticated = require("../middleware/authMiddleware");
const updateLastActive = require("../middleware/updateLastActiveMiddleware");

// Route for fetching user data
router.get("/", ensureAuthenticated, getData, updateLastActive);

module.exports = router;
