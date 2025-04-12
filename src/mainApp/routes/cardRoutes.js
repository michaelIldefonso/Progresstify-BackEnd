const express = require('express');
const pool = require('../../config/db'); // Import database connection
const updateLastActive = require("../../middleware/updateLastActiveMiddleware"); // Import middleware
const ensureAuthenticated = require("../../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

// GET route to fetch cards by board
router.get('/boards/:boardId/cards', ensureAuthenticated, updateLastActive, async (req, res) => {
    const { boardId } = req.params;
    try {
        const result = await pool.query(
            `SELECT cards.id, cards.column_id, cards.text, cards.checked, cards.position
             FROM cards
             INNER JOIN columns ON cards.column_id = columns.id
             WHERE columns.board_id = $1
             ORDER BY cards.position`,
            [boardId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST route to create a new card
router.post('/create', ensureAuthenticated, updateLastActive, async (req, res) => {
    const { column_id, text, checked, position } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO cards (column_id, text, checked, position) VALUES ($1, $2, $3, $4) RETURNING *",
            [column_id, text, checked, position]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE route to delete a card
router.delete('/cards/:id', ensureAuthenticated, updateLastActive, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM cards WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json({ message: "Card deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT route to rename/retitle a card
router.put('/cards/:id', ensureAuthenticated, updateLastActive, async (req, res) => {
    const { id } = req.params;
    const { title, text, checked, position } = req.body;
    try {
        const result = await pool.query(
            "UPDATE cards SET title = $1, text = $2, checked = $3, position = $4 WHERE id = $5 RETURNING *",
            [title, text, checked, position, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json({ message: "Card updated successfully", card: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH route to toggle the checked status of a card
router.patch('/cards/:id/checked', ensureAuthenticated, updateLastActive, async (req, res) => {
    const { id } = req.params;
    const { checked } = req.body;

    if (typeof checked !== 'boolean') {
        return res.status(400).json({ message: "Checked status must be a boolean" });
    }

    try {
        const result = await pool.query(
            "UPDATE cards SET checked = $1 WHERE id = $2 RETURNING *",
            [checked, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json({ message: "Card checked status updated", card: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
