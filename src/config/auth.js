require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const logger = require('./logger'); // Adjust path if needed


console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);


const getUserFromDB = async (id) => {
    try {
        console.log("🔍 Fetching user from DB for ID:", id);
        
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        console.log("📢 Raw DB Result:", result.rows);

        if (result.rows.length > 0) {
            console.log("✅ User found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.error("❌ No user found for ID:", id);
            return null;
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
        const oauthId = profile.id; // Ensure profile.id exists

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        console.log("DB Query Result:", result.rows); // Log before using result.rows

        let user;
        if (result.rows.length > 0) {
            user = result.rows[0]; // Existing user
            console.log("Existing User Found:", user);
        } else {
            // Insert new user into database
            const insert = await pool.query(
                'INSERT INTO users (name, email, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, oauthProvider, oauthId] // Pass profile.id as oauth_id
            );
            user = insert.rows[0];
            console.log("New User Created:", user);
        }

        console.log("Final User before done():", user, "Type:", typeof user);

        if (!user) {
            throw new Error("User is unexpectedly undefined!");
        }

        return done(null, user);
    } catch (err) {
        console.error("Authentication Error:", err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log("📌 Serializing User ID:", user.id);
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    logger.debug(`🔄 Deserializing user with ID: ${id}`);

    if (!id) {
        logger.error("❌ No user ID found in session.");
        return done(null, false);
    }

    try {
        const user = await getUserFromDB(id);
        if (!user) {
            logger.warn(`⚠️ User not found for ID: ${id}`);
            return done(null, false);
        }
        logger.info(`✅ User deserialized: ${JSON.stringify(user)}`);
        done(null, user);
    } catch (err) {
        logger.error(`❌ Error during deserialization: ${err.message}`);
        done(err, null);
    }
});



module.exports = passport;
