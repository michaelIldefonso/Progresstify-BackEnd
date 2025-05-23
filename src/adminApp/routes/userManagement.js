const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const checkAdmin = require("../../middleware/checkOnlyAdmin"); // Import checkAdmin middleware
const userController = require("../controllers/userController");

const router = express.Router();

// Apply common middlewares to all routes
router.use(ensureAuthenticated, updateLastActive);

// Route handlers
router.get("/users", checkAdmin, userController.fetchAllUsers);
router.put("/users/:id/role", checkAdmin, userController.modifyUserRole);
router.delete("/users/:id", checkAdmin, userController.removeUser);

module.exports = router;
