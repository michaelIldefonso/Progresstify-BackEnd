const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdmin = require('../../middleware/checkAdmin');

// Route to get the count of active accounts
router.get('/charts/active-accounts', ensureAuthenticated, checkAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) AS active_accounts FROM users WHERE last_active >= NOW() - INTERVAL \'7 days\''
        );
        res.json({ activeAccounts: result.rows[0].active_accounts });
    } catch (err) {
        console.error("Error fetching active accounts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get the count of new users
router.get('/charts/new-users', ensureAuthenticated, checkAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS new_users FROM users WHERE created_at >= NOW() - INTERVAL \'30 days\'');
        res.json({ newUsers: result.rows[0].new_users });
    } catch (err) {
        console.error("Error fetching new users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get the total number of users
router.get('/charts/total-users', ensureAuthenticated, checkAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS total_users FROM users');
        res.json({ totalUsers: result.rows[0].total_users });
    } catch (err) {
        console.error("Error fetching total users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
