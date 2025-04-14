const pool = require("../../config/db");

const getWorkspacesByUserId = async (userId) => {
  const result = await pool.query("SELECT * FROM workspaces WHERE owner_id = $1", [userId]);
  return result.rows;
};

const createWorkspace = async (name, userId) => {
  const result = await pool.query(
    "INSERT INTO workspaces (name, owner_id) VALUES ($1, $2) RETURNING *",
    [name, userId]
  );
  return result.rows[0];
};

const deleteWorkspaceById = async (workspaceId, userId) => {
  const result = await pool.query(
    "DELETE FROM workspaces WHERE id = $1 AND owner_id = $2 RETURNING *",
    [workspaceId, userId]
  );
  return result;
};

const renameWorkspaceById = async (workspaceId, userId, newName) => {
  const result = await pool.query(
    "UPDATE workspaces SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
    [newName, workspaceId, userId]
  );
  return result.rows[0];
};

module.exports = {
  getWorkspacesByUserId,
  createWorkspace,
  deleteWorkspaceById,
  renameWorkspaceById,
};
