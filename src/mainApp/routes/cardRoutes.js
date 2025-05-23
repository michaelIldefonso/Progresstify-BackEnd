// Card routes for handling card-related endpoints.
// Applies authentication and last-active update middleware to all routes.
// Imports controller methods for card CRUD and utility operations.

const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const cardController = require("../controllers/cardController"); // Import controller

const router = express.Router();

router.use(ensureAuthenticated);

// POST route to create a new card
router.post(
  "/create",
  cardController.createCardHandler
);

// DELETE route to delete a card
router.delete(
  "/:id",
  cardController.deleteCardHandler
);

// PUT route to update a card
router.put(
  "/cards/:id",
  cardController.updateCardHandler
);

// PATCH route to toggle the checked status of a card
router.patch(
  "/:id/checked",
  cardController.toggleCardCheckedHandler
);

// PATCH route to move a card
router.patch(
  "/:id/move",
  cardController.moveCardHandler
);

// Update due date for a card
router.patch(
  "/:id/due-date",
  cardController.updateCardDueDateHandler
);

// Get tasks with upcoming deadlines
router.get(
  "/upcoming",
  cardController.getUpcomingTasksHandler
);

router.patch(
  "/:id/text",
  cardController.updateCardText
);

router.use(updateLastActive);

module.exports = router;
