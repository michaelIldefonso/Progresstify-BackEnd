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

        // Check if user exists in the database
        let userResult = await pool.query('SELECT * FROM users WHERE oauth_id = $1 AND oauth_provider = $2', [profile.id, oauthProvider]);

        if (userResult.rows.length === 0) {
            // If user does not exist, create a new user
            const insertResult = await pool.query(
                'INSERT INTO users (email, name, oauth_id, oauth_provider) VALUES ($1, $2, $3, $4) RETURNING *',
                [email, name, profile.id, oauthProvider]
            );
            userResult = insertResult;
        }

        const user = userResult.rows[0];
        user.generateJwt = function () {
            return jwt.sign({ id: this.id, email: this.email, oauth_id: this.oauth_id, name: this.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        };

        console.log("User authenticated:", user);
        return done(null, user);
    } catch (err) {
        console.error("Error in GoogleStrategy callback:", err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log("Serializing User:", user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log("🔄 Deserializing User ID:", id); // Should always log
    try {
        const user = await getUserFromDB(id); // Fetch from DB
        console.log("✅ User found:", user);
        done(null, user);
    } catch (err) {
        console.error("❌ Error in deserializeUser:", err);
        done(err, null);
    }
});

module.exports = passport;