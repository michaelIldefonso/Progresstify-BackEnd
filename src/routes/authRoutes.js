const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const checkAdmin = require("../middleware/checkAdmin"); // Import checkAdmin middleware

const router = express.Router();

// User login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        try {
            const token = req.user.generateJwt();
            res.redirect(`${process.env.CLIENT_URL}/workspace?token=${token}`);
        } catch (err) {
            console.error("OAuth Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Admin login route
router.get(
    "/admin/google",
    passport.authenticate("google-admin", { scope: ["profile", "email"] })
);

router.get(
    "/admin/google/callback",
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

router.get("/logout", authController.logout);

module.exports = router;