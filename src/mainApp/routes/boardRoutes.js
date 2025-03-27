const express = require("express");
const pool = require("../../config/db"); // Updated path
const ensureAuthenticated = require("../../middleware/authMiddleware"); // Updated path

const router = express.Router({ mergeParams: true }); // Enable access to workspaceId from parent route

// Get boards in a workspace
router.get("/:workspaceId/boards", ensureAuthenticated, async (req, res) => {
  const { workspaceId } = req.params; // Get workspaceId from URL
  try {
    const result = await pool.query("SELECT * FROM boards WHERE workspace_id = $1", [workspaceId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new board
router.post("/:workspaceId/boards", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;
  const { workspaceId } = req.params; // Get workspaceId from URL
  try {
    const result = await pool.query(
      "INSERT INTO boards (name, workspace_id) VALUES ($1, $2) RETURNING *",
      [name, workspaceId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a board
router.delete("/:workspaceId/boards/:boardId", ensureAuthenticated, async (req, res) => {
    const { workspaceId, boardId } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM boards WHERE id = $1 AND workspace_id = $2 RETURNING *",
            [boardId, workspaceId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Board not found or not authorized" });
        }

        res.status(200).json({ message: "Board deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Rename a board
router.put("/:workspaceId/boards/:boardId/rename", ensureAuthenticated, async (req, res) => {
    const { workspaceId, boardId } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ message: "New name is required" });
    }

    try {
        const result = await pool.query(
            "UPDATE boards SET name = $1 WHERE id = $2 AND workspace_id = $3 RETURNING *",
            [newName, boardId, workspaceId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Board not found or not authorized" });
        }

        res.status(200).json({ message: "Board renamed successfully", board: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;