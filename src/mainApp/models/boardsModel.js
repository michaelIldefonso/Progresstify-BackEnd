const pool = require("../../config/db");

const getBoardsByWorkspaceId = async (workspaceId) => {
  const result = await pool.query("SELECT * FROM boards WHERE workspace_id = $1", [workspaceId]);
  return result.rows;
};

const createBoard = async (name, workspaceId) => {
  const result = await pool.query(
    "INSERT INTO boards (name, workspace_id) VALUES ($1, $2) RETURNING *",
    [name, workspaceId]
  );
  return result.rows[0];
};

const deleteBoardById = async (boardId, workspaceId) => {
  const result = await pool.query(
    "DELETE FROM boards WHERE id = $1 AND workspace_id = $2 RETURNING *",
    [boardId, workspaceId]
  );
  return result;
};

const renameBoardById = async (boardId, workspaceId, newName) => {
  const result = await pool.query(
    "UPDATE boards SET name = $1 WHERE id = $2 AND workspace_id = $3 RETURNING *",
    [newName, boardId, workspaceId]
  );
  return result.rows[0];
};

const getWorkspaceIdByBoardId = async (boardId) => {
  const result = await pool.query("SELECT workspace_id FROM boards WHERE id = $1", [boardId]);
  return result.rows[0]?.workspace_id;
}


module.exports = {
  getBoardsByWorkspaceId,
  createBoard,
  deleteBoardById,
  renameBoardById,
  getWorkspaceIdByBoardId,
};
