// Load environment variables from .env file
require('dotenv').config();

// Import Passport.js and Google OAuth strategy
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Import helper functions for user management
const { findOrCreateUser } = require('../services/authService');

// Configure Google strategy for mainApp authentication
passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
            callbackURL: process.env.GOOGLE_CALLBACK_URL, // Callback URL for mainApp
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email from Google profile
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null; 
               
                if (!email) {
                    throw new Error("Email not available in Google profile");
                }
                // Find or create user in the database
                const user = await findOrCreateUser('google', { ...profile, email }); 
                return done(null, user);
            } catch (err) {
                console.error("Error in GoogleStrategy callback:", err);
                return done(err, null);
            }
        }
    )
);

// Configure Google strategy for adminApp authentication
passport.use(
    "google-admin",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
            callbackURL: process.env.ADMIN_GOOGLE_CALLBACK_URL, // Callback URL for adminApp
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email from Google profile
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null; 
                
                if (!email) {
                    throw new Error("Email not available in Google profile");
                }
                // Find or create user in the database
                const user = await findOrCreateUser('google', { ...profile, email }); 
                return done(null, user);
            } catch (err) {
                console.error("Error in GoogleStrategy callback:", err);
                return done(err, null);
            }
        }
    )
);

// Serialize user information into session or token
const googleSerializeUser = (user, done) => {
    done(null, user.id); // Store user ID
};

// Deserialize user information from session or token
const googleDeserializeUser = async (id, done) => {
    try {
        // Retrieve user from database using ID
        const user = await findOrCreateUser('deserialize', { id });
        done(null, user);
    } catch (err) {
        console.error("Error in Google deserializeUser:", err);
        done(err, null);
    }
};

// Register serialize and deserialize functions with Passport.js
passport.serializeUser(googleSerializeUser);
passport.deserializeUser(googleDeserializeUser);

// Export configured Passport.js instance
module.exports = passport;