// Workspace routes for handling workspace-related endpoints.
// Applies authentication and last-active update middleware to all routes.
// Imports controller methods for workspace CRUD operations.

const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const { updateLastActiveNonBlocking } = require("../../middleware/updateLastActiveMiddleware");
const workspaceController = require("../controllers/workspaceController"); // Import controller

const router = express.Router();

// Timing middleware to log request duration
router.use((req, res, next) => {
  req._startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req._startTime;
    console.log(`[WorkspaceRoutes] ${req.method} ${req.originalUrl} took ${duration}ms`);
  });
  next();
});

router.use(ensureAuthenticated);
router.use(updateLastActiveNonBlocking);

// Get workspaces for a user
router.get(
    "/",
    (req, res, next) => { console.log('GET /api/workspaces handler start'); next(); },
    workspaceController.getWorkspaces,
    (req, res, next) => { console.log('GET /api/workspaces handler end'); next(); }
);

// Create a new workspace
router.post(
    "/", 
    workspaceController.createWorkspace);

// Delete a workspace
router.delete(
    "/:id", 
    workspaceController.deleteWorkspace);

// Rename a workspace
router.put(
    "/:id/rename",  
    workspaceController.renameWorkspace);

module.exports = router;
