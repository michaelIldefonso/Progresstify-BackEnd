const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/user", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Retrieve user data from the database using OAuth2 email
        const result = await pool.query(
            "SELECT id, name, email, role_id FROM users WHERE email = $1",
            [req.user.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]); // ✅ Return full user details
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
