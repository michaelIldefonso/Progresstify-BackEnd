const workspaceModel = require("../models/workspaceModel");

const getWorkspaces = async (userId) => {
  return await workspaceModel.getWorkspacesByUserId(userId);
};

const createWorkspace = async (name, userId, description) => {
 
  return await workspaceModel.createWorkspace(name, userId, description);
};

const deleteWorkspace = async (workspaceId, userId) => {
  return await workspaceModel.deleteWorkspaceById(workspaceId, userId);
};

const renameWorkspace = async (workspaceId, userId, newName) => {
  return await workspaceModel.renameWorkspaceById(workspaceId, userId, newName);
};

const getUserIdByworkspaceId = async (workspaceId) => {
  return await workspaceModel.getUserIdByworkspaceId(workspaceId);
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  renameWorkspace,
  getUserIdByworkspaceId,
};
