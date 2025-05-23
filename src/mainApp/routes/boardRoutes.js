// Board routes for handling board-related endpoints within a workspace.
// Applies authentication and last-active update middleware to all routes.
// Imports controller methods for board CRUD operations.


const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const boardController = require("../controllers/boardController"); // Import controller

const router = express.Router({ mergeParams: true });

// Apply ensureAuthenticated middleware to all routes
router.use(ensureAuthenticated);

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

// Apply updateLastActive middleware at the end
router.use(updateLastActive);

module.exports = router;