// Service functions for column operations. These currently wrap columnModel methods and are prepared for future logic or validation.

const columnModel = require("../models/columnModel");

const getColumnsWithCards = async (boardId) => {
  return await columnModel.getColumnsWithCardsByBoardId(boardId);
};

const createColumn = async (boardId, title, position) => {
  return await columnModel.createColumn(boardId, title, position);
};

const deleteColumn = async (columnId) => {
  return await columnModel.deleteColumnById(columnId);
};

const renameColumn = async (columnId, title) => {
  return await columnModel.renameColumnById(columnId, title);
};

const updateColumnPosition = async (boardId, columnId, newPosition, currentPosition) => {
  return await columnModel.updateColumnPosition(boardId, columnId, newPosition, currentPosition);
};

const getBoardsIdByColumnId = async (columnId) => {
  return await columnModel.getBoardsIdByColumnId(columnId);
};

const getColumnPosition = async (columnId) => {
  return await columnModel.getColumnPosition(columnId);
};

module.exports = {
  getColumnsWithCards,
  createColumn,
  deleteColumn,
  renameColumn,
  updateColumnPosition,
  getBoardsIdByColumnId,
  getColumnPosition,
};
