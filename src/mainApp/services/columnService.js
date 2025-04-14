const columnModel = require("../models/columnModel");

const getColumnsWithCards = async (boardId) => {
  return await columnModel.getColumnsWithCardsByBoardId(boardId);
};

const createColumn = async (boardId, title, order) => {
  return await columnModel.createColumn(boardId, title, order);
};

const deleteColumn = async (columnId) => {
  return await columnModel.deleteColumnById(columnId);
};

const renameColumn = async (columnId, title) => {
  return await columnModel.renameColumnById(columnId, title);
};

const updateColumnOrder = async (boardId, columnId, newOrder, currentOrder) => {
  return await columnModel.updateColumnOrder(boardId, columnId, newOrder, currentOrder);
};

module.exports = {
  getColumnsWithCards,
  createColumn,
  deleteColumn,
  renameColumn,
  updateColumnOrder,
};
