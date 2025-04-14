const cardModel = require("../models/cardModel");

const createCard = async (columnId, text, checked, position) => {
  return await cardModel.createCard(columnId, text, checked, position);
};

const deleteCard = async (id) => {
  return await cardModel.deleteCardById(id);
};

const updateCard = async (id, title, text, checked, position) => {
  return await cardModel.updateCard(id, title, text, checked, position);
};

const toggleCardChecked = async (id, checked) => {
  return await cardModel.toggleCardChecked(id, checked);
};

const moveCard = async (id, columnId, position) => {
  return await cardModel.moveCard(id, columnId, position);
};

module.exports = {
  createCard,
  deleteCard,
  updateCard,
  toggleCardChecked,
  moveCard,
};
