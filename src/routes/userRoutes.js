const express = require("express");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", ensureAuthenticated, async (req, res) => {
    try {
        const user = req.user;
        res.json({ id: user.id, email: user.email });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;