const express = require("express");
const passport = require("passport");
const checkAdmin = require("../middleware/checkAdmin");
const { handleGoogleCallback, googleLogin } = require("../controllers/adminGoogleAuthController");

const router = express.Router();

// AdminApp login route
router.get("/google", googleLogin);

router.get(
    "/google/callback",
    passport.authenticate("google-admin", { session: false, failureRedirect: "/" }),
    checkAdmin, // Ensure the user is an admin
    handleGoogleCallback
);

module.exports = router;
