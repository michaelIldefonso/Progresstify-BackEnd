const pool = require('../config/db');

// Fetch user by Firebase UID
async function getUserByFirebaseUid(uid) {
    const result = await pool.query(
        'SELECT * FROM users WHERE oauth_id = $1 AND oauth_provider = $2',
        [uid, 'firebase']
    );
    return result.rows[0];
}

// Create a new user with Firebase UID
async function createUserWithFirebase(uid, email, name) {
    const result = await pool.query(
        'INSERT INTO users (email, name, oauth_id, oauth_provider, last_login) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [email, name, uid, 'firebase']
    );
    return result.rows[0];
}

// Update last login for a Firebase user
async function updateLastLogin(userId) {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
}

module.exports = {
    getUserByFirebaseUid,
    createUserWithFirebase,
    updateLastLogin,
};
