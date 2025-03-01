const express = require('express');
const passport = require('passport');

const router = express.Router();

// Route for initiating Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        try {
            console.log("✅ Login Success! Redirecting...");
            // Generate JWT token
            const token = req.user.generateJwt();
            console.log("Generated Token:", token); // Log the generated token
            res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
        } catch (err) {
            console.error("Error during Google OAuth callback:", err);
            res.status(500).send("Internal Server Error");
        }
    }
);

module.exports = router;