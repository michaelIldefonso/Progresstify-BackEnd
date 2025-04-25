const workspaceModel = require("../models/workspaceModel");

const getWorkspaces = async (userId) => {
  return await workspaceModel.getWorkspacesByUserId(userId);
};

const createWorkspace = async (name, userId, description) => {
  console.log("Service layer received:", { name, userId, description }); // Debug log
  return await workspaceModel.createWorkspace(name, userId, description);
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
