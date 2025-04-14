const cardService = require("../services/cardService");

const createCardHandler = async (req, res) => {
  const { column_id, text, checked, position } = req.body;
  try {
    const card = await cardService.createCard(column_id, text, checked, position);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const updateCardHandler = async (req, res) => {
  const { id } = req.params;
  const { title, text, checked, position } = req.body;
  try {
    const card = await cardService.updateCard(id, title, text, checked, position);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card updated successfully", card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const moveCardHandler = async (req, res) => {
  const { id } = req.params;
  const { column_id, position } = req.body;

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

module.exports = {
  createCardHandler,
  deleteCardHandler,
  updateCardHandler,
  toggleCardCheckedHandler,
  moveCardHandler,
};
