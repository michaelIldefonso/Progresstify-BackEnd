// Column routes for handling column-related endpoints within a board.
// Applies authentication and last-active update middleware to all routes.
// Imports controller methods for column CRUD and position operations.

const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const columnController = require("../controllers/columnController"); // Import controller

const router = express.Router({ mergeParams: true });

// Apply ensureAuthenticated middleware to all routes
router.use(ensureAuthenticated);

// Route handlers
router.get(
  "/:boardId/columns-with-cards",
  columnController.getColumnsWithCards
);

router.post(
  "/:boardId/columns",
  columnController.createColumnHandler
);

router.delete(
  "/:boardId/columns/:columnId",
  columnController.deleteColumnHandler
);

router.put(
  "/:boardId/columns/:columnId",
  columnController.renameColumnHandler
);

router.put(
  "/:boardId/columns/:columnId/position",
  columnController.updateColumnPositionHandler
);

// Apply updateLastActive middleware at the end
router.use(updateLastActive);

module.exports = router;