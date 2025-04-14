const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const columnController = require("../controllers/columnController"); // Import controller

const router = express.Router({ mergeParams: true });

router.use(updateLastActive);

// Get columns and their associated cards in a board
router.get(
  "/:boardId/columns-with-cards",
  ensureAuthenticated,
  updateLastActive,
  columnController.getColumnsWithCards
);

// Create a new column
router.post(
  "/:boardId/columns",
  ensureAuthenticated,
  updateLastActive,
  columnController.createColumnHandler
);

// Delete a column
router.delete(
  "/:boardId/columns/:columnId",
  ensureAuthenticated,
  updateLastActive,
  columnController.deleteColumnHandler
);

// Rename a column
router.put(
  "/:boardId/columns/:columnId",
  ensureAuthenticated,
  updateLastActive,
  columnController.renameColumnHandler
);

// Update column order
router.put(
  "/:boardId/columns/:columnId/order",
  ensureAuthenticated,
  updateLastActive,
  columnController.updateColumnOrderHandler
);

module.exports = router;