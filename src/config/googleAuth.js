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

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL, // Default callback for main app
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Access Token:", accessToken); // Debug log
                console.log("Profile:", profile); // Debug log

                const { email, name } = profile._json;
                const oauthProvider = 'google';

                // Check if user exists in the oauth_accounts table
                let oauthResult = await pool.query(
                    `SELECT users.* 
                     FROM oauth_accounts 
                     JOIN users ON oauth_accounts.user_id = users.id 
                     WHERE oauth_accounts.oauth_id = $1 AND oauth_accounts.oauth_provider = $2`,
                    [profile.id, oauthProvider]
                );

                let user;

                if (oauthResult.rows.length === 0) {
                    // User does not exist, create new user and oauth account
                    const userResult = await pool.query(
                        'INSERT INTO users (email, name, last_login) VALUES ($1, $2, NOW()) RETURNING *',
                        [email, name]
                    );
                    user = userResult.rows[0];

                    await pool.query(
                        'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)',
                        [user.id, oauthProvider, profile.id, email]
                    );
                } else {
                    // Update last_login for existing user
                    user = oauthResult.rows[0];
                    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
                }

                user.generateJwt = function () {
                    return jwt.sign(
                        {
                            id: this.id,
                            email: this.email,
                            oauth_id: profile.id,
                            name: this.name,
                            role_id: this.role_id,
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "5h" }
                    );
                };

                return done(null, user);
            } catch (err) {
                console.error("Error in GoogleStrategy callback:", err); // Log the error
                return done(err, null);
            }
        }
    )
);

passport.use(
    "google-admin",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.ADMIN_GOOGLE_CALLBACK_URL, // Callback for admin app
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Access Token:", accessToken); // Debug log
                console.log("Profile:", profile); // Debug log

                const { email, name } = profile._json;
                const oauthProvider = 'google';

                // Check if user exists in the oauth_accounts table
                let oauthResult = await pool.query(
                    `SELECT users.* 
                     FROM oauth_accounts 
                     JOIN users ON oauth_accounts.user_id = users.id 
                     WHERE oauth_accounts.oauth_id = $1 AND oauth_accounts.oauth_provider = $2`,
                    [profile.id, oauthProvider]
                );

                let user;

                if (oauthResult.rows.length === 0) {
                    // User does not exist, create new user and oauth account
                    const userResult = await pool.query(
                        'INSERT INTO users (email, name, last_login) VALUES ($1, $2, NOW()) RETURNING *',
                        [email, name]
                    );
                    user = userResult.rows[0];

                    await pool.query(
                        'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)',
                        [user.id, oauthProvider, profile.id, email]
                    );
                } else {
                    // Update last_login for existing user
                    user = oauthResult.rows[0];
                    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
                }

                user.generateJwt = function () {
                    return jwt.sign(
                        {
                            id: this.id,
                            email: this.email,
                            oauth_id: this.oauth_id,
                            name: this.name,
                            role_id: this.role_id,
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "5h" }
                    );
                };

                return done(null, user);
            } catch (err) {
                console.error("Error in GoogleStrategy callback:", err); // Log the error
                return done(err, null);
            }
        }
    )
);

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