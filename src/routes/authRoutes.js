const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

// MainApp user login route
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

router.get("/logout", authController.logout);

module.exports = router;