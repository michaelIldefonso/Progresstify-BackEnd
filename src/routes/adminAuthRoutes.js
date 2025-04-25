const express = require("express");
const passport = require("passport");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

// AdminApp login route
router.get(
    "/google",
    passport.authenticate("google-admin", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google-admin", { session: false, failureRedirect: "/" }),
    checkAdmin, // Ensure the user is an admin
    (req, res) => {
        try {
            console.log("Admin user:", req.user); // Debug log to verify req.user
            const token = req.user.generateJwt();
            res.redirect(`${process.env.ADMIN_URL}/home?token=${token}`);
        } catch (err) {
            console.error("OAuth Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

module.exports = router;
