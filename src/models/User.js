const pool = require('../config/db');

// Function to fetch user details by email, including OAuth account details if available
async function getUserByEmail(email) {
    const result = await pool.query(
        `SELECT users.*, oauth_accounts.oauth_provider, oauth_accounts.oauth_id 
         FROM users 
         LEFT JOIN oauth_accounts ON users.id = oauth_accounts.user_id 
         WHERE users.email = $1`, 
        [email]
    ); // Fetch user and OAuth details
    return result.rows[0]; // Return the first row of the result
}

// Function to create a new user in the database
// If OAuth details are provided, they are also linked to the user
async function createUser(name, email, oauthProvider = null, oauthId = null) {
    const client = await pool.connect(); // Establish a connection to the database
    try {
        await client.query('BEGIN'); // Start a transaction

        const userResult = await client.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
            [name, email]
        ); // Insert into users table and return the created user
        const user = userResult.rows[0];

        if (oauthProvider && oauthId) {
            await client.query(
                'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)', 
                [user.id, oauthProvider, oauthId, email]
            ); // Link OAuth account to the user
        }

        await client.query('COMMIT'); // Commit the transaction
        return user; // Return the created user
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of an error
        throw err; // Re-throw the error to be handled by the caller
    } finally {
        client.release(); // Release the database connection
    }
}

// Function to update the last login timestamp for a user
async function updateLastLogin(userId) {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]); // Update the last_login field
}

// Function to update the last active timestamp for a user in the database
async function updateLastActiveQuery(userId) {
    await pool.query(
        "UPDATE users SET last_active = NOW() WHERE id = $1",
        [userId]
    ); // Update the last_active field
}

// Function to link an OAuth account to an existing user
async function linkOAuthAccount(userId, oauthProvider, oauthId, email) {
    await pool.query(
        'INSERT INTO oauth_accounts (user_id, oauth_provider, oauth_id, email) VALUES ($1, $2, $3, $4)',
        [userId, oauthProvider, oauthId, email]
    ); // Insert OAuth account details into the oauth_accounts table
}

// Function to fetch an OAuth account by its ID and provider
async function getOAuthAccount(oauthId, oauthProvider) {
    const result = await pool.query(
        `SELECT * FROM oauth_accounts 
         WHERE oauth_id = $1 AND oauth_provider = $2`,
        [oauthId, oauthProvider]
    ); // Fetch OAuth account details
    return result.rows[0]; // Return the first row of the result
}

// Function to fetch user details by ID, including OAuth account details if available
async function getUserById(id) {
    const result = await pool.query(
        `SELECT users.*, oauth_accounts.oauth_provider, oauth_accounts.oauth_id 
         FROM users 
         LEFT JOIN oauth_accounts ON users.id = oauth_accounts.user_id 
         WHERE users.id = $1`,
        [id]
    ); // Fetch user and OAuth details by ID
    return result.rows[0]; // Return the first row of the result
}

// Exporting all user-related functions for use in other parts of the application
module.exports = { 
    getUserByEmail, 
    createUser, 
    updateLastLogin, 
    linkOAuthAccount, 
    getOAuthAccount, 
    updateLastActiveQuery,
    getUserById // Export the new function
};