// Model for interacting with the 'workspaces' table in the database
// Provides CRUD operations for workspaces
const pool = require("../../config/db");

// Get all workspaces for a specific user
const getWorkspacesByUserId = async (userId) => {
  const result = await pool.query("SELECT * FROM workspaces WHERE owner_id = $1", [userId]);
  return result.rows;
};

// Create a new workspace for a user
const createWorkspace = async (name, userId, description) => {
  const result = await pool.query(
    "INSERT INTO workspaces (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *",
    [name, userId, description]
  );
  return result.rows[0];
};

// Delete a workspace by its ID and owner ID
const deleteWorkspaceById = async (workspaceId, userId) => {
  const result = await pool.query(
    "DELETE FROM workspaces WHERE id = $1 AND owner_id = $2 RETURNING *",
    [workspaceId, userId]
  );
  return result;
};

// Rename a workspace by its ID and owner ID
const renameWorkspaceById = async (workspaceId, userId, newName) => {
  const result = await pool.query(
    "UPDATE workspaces SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
    [newName, workspaceId, userId]
  );
  return result.rows[0];
};

// Get the user ID (owner) for a given workspace ID
const getUserIdByworkspaceId = async (workspaceId) => {
  const result = await pool.query("SELECT owner_id FROM workspaces WHERE id = $1", [workspaceId]);
  return result.rows[0]?.owner_id;
};

// Export all workspace-related functions
module.exports = {
  getWorkspacesByUserId,
  createWorkspace,
  deleteWorkspaceById,
  renameWorkspaceById,
  getUserIdByworkspaceId,
};
