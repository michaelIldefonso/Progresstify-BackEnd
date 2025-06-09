// Board routes for handling board-related endpoints within a workspace.
// Applies authentication and last-active update middleware to all routes.
// Imports controller methods for board CRUD operations.


const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const { updateLastActiveNonBlocking } = require("../../middleware/updateLastActiveMiddleware");
const boardController = require("../controllers/boardController"); // Import controller

const router = express.Router({ mergeParams: true });

// Timing middleware to log request duration
router.use((req, res, next) => {
  req._startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req._startTime;
    console.log(`[BoardRoutes] ${req.method} ${req.originalUrl} took ${duration}ms`);
  });
  next();
});

// Apply ensureAuthenticated and updateLastActive middleware to all routes
router.use(ensureAuthenticated);
router.use(updateLastActiveNonBlocking);

// Route handlers
router.post(
  "/:workspaceId/boards",
  boardController.createBoardHandler
);

router.delete(
  "/:workspaceId/boards/:boardId",
  boardController.deleteBoard
);

router.patch(
  "/:workspaceId/boards/:boardId/rename",
  boardController.renameBoard
);

router.get(
  "/:workspaceId/boards",
  boardController.getBoards
);

module.exports = router;