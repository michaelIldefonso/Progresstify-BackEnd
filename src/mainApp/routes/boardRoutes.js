const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const boardController = require("../controllers/boardController"); // Import controller

const router = express.Router({ mergeParams: true });

router.use(updateLastActive);

// Get boards in a workspace
router.get("/:workspaceId/boards", ensureAuthenticated, updateLastActive, boardController.getBoards);

// Create a new board
router.post("/:workspaceId/boards", ensureAuthenticated, updateLastActive, boardController.createBoard);

// Delete a board
router.delete("/:workspaceId/boards/:boardId", ensureAuthenticated, updateLastActive, boardController.deleteBoard);

// Rename a board
router.put("/:workspaceId/boards/:boardId/rename", ensureAuthenticated, updateLastActive, boardController.renameBoard);

module.exports = router;