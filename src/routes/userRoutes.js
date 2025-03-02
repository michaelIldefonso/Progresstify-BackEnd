const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const ensureAuthenticated = require("../middleware/authMiddleware");

router.get("/", ensureAuthenticated, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, email FROM users");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;
