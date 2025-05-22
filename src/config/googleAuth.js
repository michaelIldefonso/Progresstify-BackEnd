require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findOrCreateUser } = require('../services/authService');

// used for mainAPp authentication
passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null; 
               
                if (!email) {
                    throw new Error("Email not available in Google profile");
                }
                const user = await findOrCreateUser('google', { ...profile, email }); 
                return done(null, user);
            } catch (err) {
                console.error("Error in GoogleStrategy callback:", err);
                return done(err, null);
            }
        }
    )
);

//used for adminApp Authentication
passport.use(
    "google-admin",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.ADMIN_GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null; // Extract email
                
                if (!email) {
                    throw new Error("Email not available in Google profile");
                }
                const user = await findOrCreateUser('google', { ...profile, email }); // Pass email explicitly
                return done(null, user);
            } catch (err) {
                console.error("Error in GoogleStrategy callback:", err);
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findOrCreateUser('deserialize', { id });
        done(null, user);
    } catch (err) {
        console.error("Error in deserializeUser:", err);
        done(err, null);
    }
});

module.exports = passport;