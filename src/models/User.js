const pool = require('../config/db');

// Queries related to fetching user data
async function getUserByEmail(email) {
    const result = await pool.query(
        `SELECT users.*, oauth_accounts.oauth_provider, oauth_accounts.oauth_id 
         FROM users 
         LEFT JOIN oauth_accounts ON users.id = oauth_accounts.user_id 
         WHERE users.email = $1`, 
        [email]
    ); // Fetch user and OAuth details
    return result.rows[0];
}

// Queries related to creating user data
async function createUser(name, email, oauthProvider = null, oauthId = null) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
            [name, email]
        ); // Insert into users table
        const user = userResult.rows[0];

        if (oauthProvider && oauthId) {
            await client.query(
                'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)', 
                [user.id, oauthProvider, oauthId, email]
            ); // Insert into oauth_accounts table
        }

        await client.query('COMMIT');
        return user;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

// Queries related to updating user data
async function updateLastLogin(userId) {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
}

// Queries related to OAuth accounts
async function linkOAuthAccount(userId, oauthProvider, oauthId, email) {
    await pool.query(
        'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)',
        [userId, oauthProvider, oauthId, email]
    );
}

async function getOAuthAccount(oauthId, oauthProvider) {
    const result = await pool.query(
        `SELECT * FROM oauth_accounts 
         WHERE oauth_id = $1 AND oauth_provider = $2`,
        [oauthId, oauthProvider]
    );
    return result.rows[0];
}

module.exports = { 
    getUserByEmail, 
    createUser, 
    updateLastLogin, 
    linkOAuthAccount, 
    getOAuthAccount 
};