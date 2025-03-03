const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
        try {
            const token = req.user.generateJwt();
            res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
        } catch (err) {
            console.error("OAuth Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

module.exports = router;