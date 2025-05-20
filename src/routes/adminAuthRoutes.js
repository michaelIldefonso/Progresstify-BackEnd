const express = require("express");
const passport = require("passport");
const checkAdminModerator = require("../middleware/checkAdminModerator");
const { handleGoogleCallback, googleLogin } = require("../controllers/adminGoogleAuthController");

const router = express.Router();

// AdminApp login route
router.get("/google", googleLogin);

router.get(
    "/google/callback",
    passport.authenticate("google-admin", { session: false, failureRedirect: "/" }),
    checkAdminModerator, // Ensure the user is an admin
    handleGoogleCallback
);

module.exports = router;
