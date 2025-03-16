const express = require("express");
const pool = require("../config/db");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true }); // Enable access to workspaceId from parent route

// Get boards in a workspace
router.get("/:workspaceId/boards", async (req, res) => {
  const { workspaceId } = req.params; // Get workspaceId from URL
  try {
    const result = await pool.query("SELECT * FROM boards WHERE workspace_id = $1", [workspaceId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new board
router.post("/:workspaceId/boards", async (req, res) => {
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

module.exports = router;