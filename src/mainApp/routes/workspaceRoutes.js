// Workspace routes for handling workspace-related endpoints.
// Applies authentication and last-active update middleware to all routes.
// Imports controller methods for workspace CRUD operations.

const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const workspaceController = require("../controllers/workspaceController"); // Import controller

const router = express.Router();

router.use(ensureAuthenticated);

// Get workspaces for a user
router.get(
    "/",
    workspaceController.getWorkspaces);

// Create a new workspace
router.post(
    "/", 
    workspaceController.createWorkspace);

// Delete a workspace
router.delete(
    "/delete/:id", 
    workspaceController.deleteWorkspace);

// Rename a workspace
router.put(
    "/rename/:id",  
    workspaceController.renameWorkspace);
    

router.use(updateLastActive);


module.exports = router;
