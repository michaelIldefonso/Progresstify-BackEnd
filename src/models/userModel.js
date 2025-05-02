const pool = require('../config/db');

// Fetch user by Firebase UID
async function getUserByFirebaseUid(uid) {
    const result = await pool.query(
        'SELECT * FROM users WHERE oauth_id = $1 AND oauth_provider = $2',
        [uid, 'firebase']
    );
    return result.rows[0];
}

// Fetch user by email
async function getUserByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
}

// Create a new user with a specific OAuth provider
async function createUserWithOAuth(uid, email, name, oauthProvider) {
    const result = await pool.query(
        'INSERT INTO users (email, name, oauth_id, oauth_provider, last_login) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [email, name, uid, oauthProvider]
    );
    return result.rows[0];
}

// Update last login for a Firebase user
async function updateLastLogin(userId) {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
}

// Link a new OAuth provider to an existing user
async function linkOAuthProvider(userId, oauthId, oauthProvider) {
    const result = await pool.query(
        'UPDATE users SET oauth_id = $1, oauth_provider = $2 WHERE id = $3 RETURNING *',
        [oauthId, oauthProvider, userId]
    );
    return result.rows[0];
}

module.exports = {
    getUserByFirebaseUid,
    getUserByEmail,
    createUserWithOAuth, // Updated function name
    updateLastLogin,
    linkOAuthProvider,
};
