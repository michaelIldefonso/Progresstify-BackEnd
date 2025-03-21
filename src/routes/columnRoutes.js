const express = require("express");
const pool = require("../config/db");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true }); // Enable access to boardId from parent route

// Get columns in a board
router.get("/:boardId/columns", ensureAuthenticated, async (req, res) => {
  const { boardId } = req.params; // Get boardId from URL
  try {
    const result = await pool.query("SELECT * FROM columns WHERE board_id = $1 ORDER BY \"order\"", [boardId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// Update column order
router.put("/:boardId/columns/:columnId/order", ensureAuthenticated, async (req, res) => {
  const { boardId, columnId } = req.params;
  const { newOrder } = req.body;
  try {
    // Get the current order of the column
    const currentOrderResult = await pool.query('SELECT "order" FROM columns WHERE id = $1', [columnId]);
    const currentOrder = currentOrderResult.rows[0].order;

    // Update the order of the column being moved
    await pool.query('UPDATE columns SET "order" = $1 WHERE id = $2', [newOrder, columnId]);

    // Adjust the order of other columns
    if (newOrder > currentOrder) {
      await pool.query(
        'UPDATE columns SET "order" = "order" - 1 WHERE board_id = $1 AND "order" > $2 AND "order" <= $3 AND id != $4',
        [boardId, currentOrder, newOrder, columnId]
      );
    } else if (newOrder < currentOrder) {
      await pool.query(
        'UPDATE columns SET "order" = "order" + 1 WHERE board_id = $1 AND "order" >= $2 AND "order" < $3 AND id != $4',
        [boardId, newOrder, currentOrder, columnId]
      );
    }

    res.status(200).json({ message: 'Column order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;