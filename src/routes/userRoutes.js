const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELEC id, name, email FROM users');
        res.json(result.rows);
    }catch (err) {
        res.status(500).json({ error: err.message});

    }
});

module.exports = router;
