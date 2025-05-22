const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const checkAdmin = require("../../middleware/checkOnlyAdmin"); // Import checkAdmin middleware
const {
    fetchAllUsers,
    modifyUserRole,
    removeUser,
} = require("../controllers/userController");

const router = express.Router();

// Apply common middlewares to all routes
router.use(ensureAuthenticated, updateLastActive);

// Route handlers
router.get("/users", checkAdmin, fetchAllUsers);
router.put("/users/:id/role", checkAdmin, modifyUserRole);
router.delete("/users/:id", checkAdmin, removeUser);

module.exports = router;
