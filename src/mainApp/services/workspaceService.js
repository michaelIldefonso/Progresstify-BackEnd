const workspaceModel = require("../models/workspaceModel");

const getWorkspaces = async (userId) => {
  return await workspaceModel.getWorkspacesByUserId(userId);
};

const createWorkspace = async (name, userId) => {
  return await workspaceModel.createWorkspace(name, userId);
};

const deleteWorkspace = async (workspaceId, userId) => {
  return await workspaceModel.deleteWorkspaceById(workspaceId, userId);
};

const renameWorkspace = async (workspaceId, userId, newName) => {
  return await workspaceModel.renameWorkspaceById(workspaceId, userId, newName);
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  renameWorkspace,
};
