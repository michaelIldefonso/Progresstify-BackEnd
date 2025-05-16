const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const workspaceController = require("../controllers/workspaceController"); // Import controller

const router = express.Router();

// Get workspaces for a user
router.get("/", ensureAuthenticated, updateLastActive, workspaceController.getWorkspaces);

// Create a new workspace
router.post("/", ensureAuthenticated, updateLastActive, workspaceController.createWorkspace);

// Delete a workspace
router.delete("/delete/:id", ensureAuthenticated, updateLastActive, workspaceController.deleteWorkspace);

// Rename a workspace
router.put("/rename/:id", ensureAuthenticated, updateLastActive,  workspaceController.renameWorkspace);

module.exports = router;
