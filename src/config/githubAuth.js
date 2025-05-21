require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { findOrCreateUser } = require('../services/authService');
const { fetchEmails } = require("../services/githubService");

passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ["user:email"], // Ensure email scope is requested
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
               
                const emails = await fetchEmails(accessToken); // Fetch all emails
               
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

passport.use(
    "github-admin",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.ADMIN_GITHUB_CALLBACK_URL,
            scope: ["user:email"], // Ensure email scope is requested
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null; // Extract email
                if (!email) {
                    throw new Error("Email not available in GitHub profile");
                }
                const user = await findOrCreateUser('github', { ...profile, email }); // Pass email explicitly
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
