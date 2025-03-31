const express = require("express");
const pool = require("../../config/db");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware"); // Import middleware

const router = express.Router();

// Get workspaces for a user
router.get("/", ensureAuthenticated, updateLastActive, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM workspaces WHERE owner_id = $1", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new workspace
router.post("/", ensureAuthenticated, updateLastActive, async (req, res) => {
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

// Delete a workspace
router.delete("/workspace/:id", ensureAuthenticated, updateLastActive, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM workspaces WHERE id = $1 AND owner_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Workspace not found or not authorized" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Rename a workspace
router.put("/workspace/:id/rename", ensureAuthenticated, updateLastActive, async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    const userId = req.user.id;

    if (!newName) {
      return res.status(400).json({ message: "New name is required" });
    }

    const result = await pool.query(
      "UPDATE workspaces SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
      [newName, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Workspace not found or not authorized" });
    }

    res.status(200).json({ message: "Workspace renamed successfully", workspace: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
