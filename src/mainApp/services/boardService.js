const boardsModel = require("../models/boardsModel");

const getBoards = async (workspaceId) => {
  return await boardsModel.getBoardsByWorkspaceId(workspaceId);
};

const createBoard = async (name, workspaceId) => {
  return await boardsModel.createBoard(name, workspaceId);
};

const deleteBoard = async (boardId, workspaceId) => {
  return await boardsModel.deleteBoardById(boardId, workspaceId);
};

const renameBoard = async (boardId, workspaceId, newName) => {
  return await boardsModel.renameBoardById(boardId, workspaceId, newName);
};

module.exports = {
  getBoards,
  createBoard,
  deleteBoard,
  renameBoard,
};
