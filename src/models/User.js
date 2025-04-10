const pool = require('../config/db');

// Queries related to fetching user data
async function getUserByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', 
        [email]
    ); // Fetch all columns
    return result.rows[0];
}

// Queries related to creating user data
async function createUser(name, email) {
    const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
        [name, email]
    ); // Default role_id handled by DB
    return result.rows[0];
}

module.exports = { 
    getUserByEmail, 
    createUser 
};