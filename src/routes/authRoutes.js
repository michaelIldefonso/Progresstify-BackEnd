const express = require("express");
const passport = require("passport");

const router = express.Router();

// ✅ Use CLIENT_URL from `.env` (Set in Render Dashboard)
const CLIENT_URL = process.env.CLIENT_URL;

// ✅ Google OAuth Login Route
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth Callback Route
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User after login:", req.user); // Debug log
    res.redirect(`/dashboard?user=${JSON.stringify(req.user)}`);
  }
);

module.exports = router;
