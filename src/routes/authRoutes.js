const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google OAuth Login Route
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback Route
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    console.log("User after login:", req.user); // Debug log
    const token = req.user.generateJwt();
    res.redirect(`/dashboard?token=${token}`);
  }
);

module.exports = router;