const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const checkAdmin = require("../../middleware/checkAdmin"); // Import checkAdmin middleware
const {
    fetchAllUsers,
    modifyUserRole,
    removeUser,
} = require("../controllers/userController");

const router = express.Router();

// Fetch all users
router.get("/users", ensureAuthenticated, updateLastActive, checkAdmin, fetchAllUsers);

// Modify user roles
router.put("/users/:id/role", ensureAuthenticated, checkAdmin, modifyUserRole);

// Delete a user
router.delete("/users/:id", ensureAuthenticated, checkAdmin, removeUser);

module.exports = router;
