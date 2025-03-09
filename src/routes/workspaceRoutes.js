const express = require("express");
const pool = require("../config/db");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// Get workspaces for a user
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM workspaces WHERE owner_id = $1", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new workspace
router.post("/", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO workspaces (name, owner_id) VALUES ($1, $2) RETURNING *",
      [name, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
