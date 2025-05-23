// Model for interacting with the 'boards' table in the database
// Provides CRUD operations for boards within a workspace
const pool = require("../../config/db");

// Get all boards for a specific workspace
const getBoardsByWorkspaceId = async (workspaceId) => {
  const result = await pool.query("SELECT * FROM boards WHERE workspace_id = $1", [workspaceId]);
  return result.rows;
};

// Create a new board in a workspace
const createBoard = async (name, workspaceId) => {
  const result = await pool.query(
    "INSERT INTO boards (name, workspace_id) VALUES ($1, $2) RETURNING *",
    [name, workspaceId]
  );
  return result.rows[0];
};

// Delete a board by its ID and workspace ID
const deleteBoardById = async (boardId, workspaceId) => {
  const result = await pool.query(
    "DELETE FROM boards WHERE id = $1 AND workspace_id = $2 RETURNING *",
    [boardId, workspaceId]
  );
  return result;
};

// Rename a board by its ID and workspace ID
const renameBoardById = async (boardId, workspaceId, newName) => {
  const result = await pool.query(
    "UPDATE boards SET name = $1 WHERE id = $2 AND workspace_id = $3 RETURNING *",
    [newName, boardId, workspaceId]
  );
  return result.rows[0];
};

// Get the workspace ID for a given board ID
const getWorkspaceIdByBoardId = async (boardId) => {
  const result = await pool.query("SELECT workspace_id FROM boards WHERE id = $1", [boardId]);
  return result.rows[0]?.workspace_id;
}

// Export all board-related functions
module.exports = {
  getBoardsByWorkspaceId,
  createBoard,
  deleteBoardById,
  renameBoardById,
  getWorkspaceIdByBoardId,
};
