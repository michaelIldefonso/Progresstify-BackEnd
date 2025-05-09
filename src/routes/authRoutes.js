const express = require("express");
const googleAuthController = require("../controllers/googleAuthController");
const githubAuthController = require("../controllers/githubAuthController");

const router = express.Router();

// Google Authentication
router.get("/google", googleAuthController.googleLogin);
router.get("/google/callback", googleAuthController.googleCallback);

// GitHub Authentication
router.get("/github", githubAuthController.githubAuth);
router.get("/github/callback", githubAuthController.githubCallback);


module.exports = router;