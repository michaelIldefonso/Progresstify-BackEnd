const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const boardController = require("../controllers/boardController"); // Import controller

const router = express.Router({ mergeParams: true });

router.use(updateLastActive);

// POST route to create a new board
router.post(
  "/:workspaceId/boards",
  ensureAuthenticated,
  updateLastActive,
  boardController.createBoardHandler
);

// DELETE route to delete a board
router.delete(
  "/:workspaceId/boards/:boardId",
  ensureAuthenticated,
  updateLastActive,
  boardController.deleteBoard
);

// PUT route to rename a board
router.put(
  "/:workspaceId/boards/:boardId/rename",
  ensureAuthenticated,
  updateLastActive,
  boardController.renameBoard
);

// GET route to fetch boards
router.get(
  "/:workspaceId/boards",
  ensureAuthenticated,
  updateLastActive,
  boardController.getBoards
);

module.exports = router;