const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.findOrCreateUser = async (oauthProvider, profile) => {
    if (oauthProvider === 'deserialize') {
        const { id } = profile;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            throw new Error('User not found');
        }
    }

    const { name } = profile._json; // Extract name
    const oauthId = profile.id;
    const email = profile.email; // Use the email explicitly passed in the profile object

    console.log("Email to be saved:", email); // Debug log

    // Check if user exists in the users table by email
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (userResult.rows.length === 0) {
        // User does not exist, create new user
        const newUserResult = await pool.query(
            'INSERT INTO users (email, name, last_login) VALUES ($1, $2, NOW()) RETURNING *',
            [email, name]
        );
        user = newUserResult.rows[0];
    } else {
        // User already exists
        user = userResult.rows[0];
    }

    // Check if OAuth account exists for the user
    const oauthResult = await pool.query(
        `SELECT * FROM oauth_accounts 
         WHERE oauth_id = $1 AND oauth_provider = $2`,
        [oauthId, oauthProvider]
    );

    if (oauthResult.rows.length === 0) {
        // Link OAuth account to the existing user
        await pool.query(
            'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)',
            [user.id, oauthProvider, oauthId, email]
        );
    } else {
        console.log(`OAuth account already linked for user ID: ${user.id}`); // Debug log
    }

    // Update last_login for the user
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    user.generateJwt = function () {
        return jwt.sign(
            {
                id: this.id,
                email: this.email,
                oauth_id: oauthId,
                name: this.name,
                role_id: this.role_id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );
    };

    return user;
};
