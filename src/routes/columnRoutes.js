const express = require("express");
const pool = require("../config/db");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true }); // Enable access to boardId from parent route

// Create a new column
router.post("/:boardId/columns", ensureAuthenticated, async (req, res) => {
  const { boardId } = req.params;
  const { title, order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO columns (board_id, title, "order", created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [boardId, title, order]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a column
router.delete("/:boardId/columns/:columnId", ensureAuthenticated, async (req, res) => {
  const { columnId } = req.params;
  try {
    await pool.query('DELETE FROM columns WHERE id = $1', [columnId]);
    res.status(200).json({ message: 'Column deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename a column
router.put("/:boardId/columns/:columnId", ensureAuthenticated, async (req, res) => {
  const { columnId } = req.params;
  const { title } = req.body;
  try {
    const result = await pool.query(
      'UPDATE columns SET title = $1 WHERE id = $2 RETURNING *',
      [title, columnId]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;