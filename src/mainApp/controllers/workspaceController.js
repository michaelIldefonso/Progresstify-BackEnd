const {
  getWorkspacesByUserId,
  createWorkspace,
  deleteWorkspaceById,
  renameWorkspaceById,
} = require("../models/workspaceModel");

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await getWorkspacesByUserId(req.user.id);
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createWorkspaceHandler = async (req, res) => {
  const { name, description } = req.body; // Extract description
  try {
    const workspace = await createWorkspace(name, req.user.id, description); // Pass description
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteWorkspace = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteWorkspaceById(id, req.user.id);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Workspace not found or not authorized" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const renameWorkspace = async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).json({ message: "New name is required" });
  }

  try {
    const workspace = await renameWorkspaceById(id, req.user.id, newName);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found or not authorized" });
    }

    res.status(200).json({ message: "Workspace renamed successfully", workspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace: createWorkspaceHandler,
  deleteWorkspace,
  renameWorkspace,
};
