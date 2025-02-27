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
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/home`); // ✅ Redirect dynamically based on environment
  }
);

module.exports = router;
