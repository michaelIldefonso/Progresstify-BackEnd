const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const cardController = require("../controllers/cardController"); // Import controller

const router = express.Router();

// POST route to create a new card
router.post(
  "/create",
  ensureAuthenticated,
  updateLastActive,
  cardController.createCardHandler
);

// DELETE route to delete a card
router.delete(
  "/:id",
  ensureAuthenticated,
  updateLastActive,
  cardController.deleteCardHandler
);

// PUT route to update a card
router.put("/cards/:id", ensureAuthenticated, updateLastActive, cardController.updateCardHandler);

// PATCH route to toggle the checked status of a card
router.patch("/:id/checked", ensureAuthenticated, updateLastActive, cardController.toggleCardCheckedHandler);

// PATCH route to move a card
router.patch("/:id/move", ensureAuthenticated, updateLastActive, cardController.moveCardHandler);

// Update due date for a card
router.patch("/:id/due-date", ensureAuthenticated, updateLastActive, cardController.updateCardDueDateHandler);

// Get tasks with upcoming deadlines
router.get("/upcoming", ensureAuthenticated, updateLastActive, cardController.getUpcomingTasksHandler);

module.exports = router;
