require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { findOrCreateUser } = require('../services/authService');
const { fetchEmails } = require("../services/githubService");

passport.use(
    "github",
    new GitHubStrategy(
        {
            // Use environment variables
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ["user:email"], // Ensure email scope is requested
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the profile has emails
                const emails = await fetchEmails(accessToken);
                
                const primaryEmail = emails.find(email => email.primary)?.email || null; // Get primary email
                
                if (!primaryEmail) {
                    throw new Error("Primary email not available in GitHub profile");
                }
                const user = await findOrCreateUser('github', { ...profile, email: primaryEmail }); // Pass primary email explicitly
                
                return done(null, user);
            } catch (err) {
                console.error("Error in GitHubStrategy callback:", err);
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
