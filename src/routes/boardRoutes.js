const express = require("express");
const pool = require("../config/db");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// Get boards in a workspace
router.get("/:workspaceId", ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM boards WHERE workspace_id = $1", [req.params.workspaceId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new board
router.post("/", ensureAuthenticated, async (req, res) => {
  const { name, workspace_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO boards (name, workspace_id) VALUES ($1, $2) RETURNING *",
      [name, workspace_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
