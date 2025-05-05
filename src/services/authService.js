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

    const { email, name } = profile._json;
    const oauthId = profile.id;

    // Check if user exists in the oauth_accounts table
    let oauthResult = await pool.query(
        `SELECT users.* 
         FROM oauth_accounts 
         JOIN users ON oauth_accounts.user_id = users.id 
         WHERE oauth_accounts.oauth_id = $1 AND oauth_accounts.oauth_provider = $2`,
        [oauthId, oauthProvider]
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
            [user.id, oauthProvider, oauthId, email]
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
