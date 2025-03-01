require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const pool = require('./db');

console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);

const getUserFromDB = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        console.error("❌ Error in getUserFromDB:", err);
        throw err;
    }
};

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

        console.log("User authenticated:", user);
        user.generateJwt = () => {
            return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
        };
        return done(null, user);
    } catch (err) {
        console.error("Error in GoogleStrategy callback:", err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserFromDB(id);
        done(null, user);
    } catch (err) {
        console.error("Error in deserializeUser:", err);
        done(err, null);
    }
});

module.exports = passport;