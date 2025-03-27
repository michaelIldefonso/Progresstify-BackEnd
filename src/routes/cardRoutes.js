const express = require('express');
const pool = require('../config/db'); // Import database connection
const router = express.Router();

// GET route to fetch cards
router.get('/cards', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, column_id, text, checked, \"order\" FROM cards");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST route to create a new card
router.post('/cards', async (req, res) => {
    const { column_id, text, checked, order } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO cards (column_id, text, checked, \"order\") VALUES ($1, $2, $3, $4) RETURNING *",
            [column_id, text, checked, order]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE route to delete a card
router.delete('/cards/:id', async (req, res) => {
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
router.put('/cards/:id', async (req, res) => {
    const { id } = req.params;
    const { title, text, checked, order } = req.body;
    try {
        const result = await pool.query(
            "UPDATE cards SET title = $1, text = $2, checked = $3, \"order\" = $4 WHERE id = $5 RETURNING *",
            [title, text, checked, order, id]
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
router.patch('/cards/:id/checked', async (req, res) => {
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
