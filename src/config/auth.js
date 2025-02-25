require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { email, name } = profile._json;
        const oauthProvider = 'google';  // Store provider dynamically

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        let user;
        if (result.rows.length > 0) {
            user = result.rows[0]; // Existing user
        } else {
            // Insert new user into database
            const insert = await pool.query(
                'INSERT INTO users (name, email, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, oauthProvider, profile.id] // Pass profile.id as oauth_id
            );
            user = insert.rows[0];
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    }catch(err) {
        done(err, null);
    }
});
module.exports = passport;
