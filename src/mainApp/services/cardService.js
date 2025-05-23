// Service functions for card operations. These are primarily wrappers for cardModel methods, set up for future business logic or validation.

const cardModel = require("../models/cardModel");

const createCard = async (columnId, text, checked, position, dueDate) => {
  return await cardModel.createCard(columnId, text, checked, position, dueDate);
};

const deleteCard = async (id) => {
  return await cardModel.deleteCardById(id);
};

const updateCard = async (id, title, text, checked, position, dueDate) => {
  return await cardModel.updateCard(id, title, text, checked, position, dueDate);
};

const toggleCardChecked = async (id, checked) => {
  return await cardModel.toggleCardChecked(id, checked);
};

const moveCard = async (id, columnId, position) => {
  return await cardModel.moveCard(id, columnId, position);
};

// Update a card's due date
const updateCardDueDate = async (id, dueDate) => {
 
  return await cardModel.updateCardDueDate(id, dueDate);
};

// Fetch tasks with upcoming deadlines
const getUpcomingTasks = async (userId, days) => {
  return await cardModel.getUpcomingTasks(userId, days);
};

const updateCardText = async (id, text) => {
  return await cardModel.updateCardText(id, text);
};

module.exports = {
  createCard,
  deleteCard,
  updateCard,
  toggleCardChecked,
  moveCard,
  updateCardDueDate,
  getUpcomingTasks,
  updateCardText,
};
