// Controller for card-related operations (CRUD, move, check, due date, etc.)
const cardService = require("../services/cardService");

// Create a new card in a column
const createCardHandler = async (req, res) => {
  const { column_id, text, checked, position, dueDate } = req.body;
  try {
    const card = await cardService.createCard(column_id, text, checked, position, dueDate);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a card by its ID
const deleteCardHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cardService.deleteCard(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update card details (title, text, checked, position, due date)
const updateCardHandler = async (req, res) => {
  const { id } = req.params;
  const { title, text, checked, position, dueDate } = req.body;
  try {
    const card = await cardService.updateCard(id, title, text, checked, position, dueDate);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card updated successfully", card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle the checked status of a card (checkbox functionality)
const toggleCardCheckedHandler = async (req, res) => {
  const { id } = req.params;
  const { checked } = req.body;

  if (typeof checked !== "boolean") {
    return res.status(400).json({ message: "Checked status must be a boolean" });
  }

  try {
    const card = await cardService.toggleCardChecked(id, checked);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card checked status updated", card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Move a card to a different column or position
const moveCardHandler = async (req, res) => {
  const { id } = req.params;
  const { column_id, position } = req.body;

  if (!column_id) {
    return res.status(400).json({ message: "Column ID is required" });
  }
  
  if (typeof position !== "number") {
    return res.status(400).json({ message: "Position must be a number" });
  }

  try {
    const card = await cardService.moveCard(id, column_id, position);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card moved successfully", card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a card's due date
const updateCardDueDateHandler = async (req, res) => {
  const { id } = req.params;
  const { dueDate } = req.body;

  if (!dueDate) {
    return res.status(400).json({ message: "Due date is required" });
  }

  try {
    const updatedCard = await cardService.updateCardDueDate(id, dueDate);
    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Due date updated successfully", card: updatedCard });
  } catch (err) {
    console.error("Error updating due date:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch tasks (cards) with upcoming deadlines for a user
const getUpcomingTasksHandler = async (req, res) => {
  const { days } = req.query;
  const userId = req.user?.id;

  try {
    const tasks = await cardService.getUpcomingTasks(userId, days || 7);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update only the text of a card
const updateCardText = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text is required and cannot be empty." });
  }

  try {
    const updatedCard = await cardService.updateCardText(id, text);
    if (!updatedCard) return res.status(404).json({ error: 'Card not found' });
    res.json({ card: updatedCard });
  } catch (err) {
    console.error('Error updating card text:', err);
    res.status(500).json({ error: 'Failed to update card text' });
  }
};

// Export all card controller handlers
module.exports = {
  createCardHandler,
  deleteCardHandler,
  updateCardHandler,
  toggleCardCheckedHandler,
  moveCardHandler,
  updateCardDueDateHandler,
  getUpcomingTasksHandler,
  updateCardText,
};
