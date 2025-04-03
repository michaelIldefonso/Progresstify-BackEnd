const express = require("express");
const ensureAuthenticated = require("../../middleware/authMiddleware");
const updateLastActive = require("../../middleware/updateLastActiveMiddleware");
const pool = require("../../config/db");

const router = express.Router();

// Fetch all users
router.get("/users", ensureAuthenticated, updateLastActive, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT users.id, users.email, users.role_id, roles.name AS role_name
             FROM users
             LEFT JOIN roles ON users.role_id = roles.id`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

// Modify user roles
router.put("/users/:id/role", ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    if (!role_id) {
        return res.status(400).json({ error: "Role ID is required" });
    }

    try {
        const result = await pool.query(
            `UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, email, role_id`,
            [role_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
