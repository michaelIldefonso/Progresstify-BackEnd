// Import the database connection pool
const pool = require('../../config/db');

// Queries specific to adminApp

// Get the count of users active in the last 7 days
const getActiveAccounts = async () => {
    const query = `
        SELECT COUNT(*) AS active_accounts 
        FROM users 
        WHERE last_active >= NOW() - INTERVAL '7 days'
    `;
    const result = await pool.query(query);
    return result.rows[0].active_accounts;
};

// Get the count of users created in the last 30 days
const getNewUsers = async () => {
    const query = `
        SELECT COUNT(*) AS new_users 
        FROM users 
        WHERE created_at >= NOW() - INTERVAL '30 days'
    `;
    const result = await pool.query(query);
    return result.rows[0].new_users;
};

// Get the total number of users
const getTotalUsers = async () => {
    const query = `
        SELECT COUNT(*) AS total_users 
        FROM users
    `;
    const result = await pool.query(query);
    return result.rows[0].total_users;
};

// Fetch all users except the currently logged-in user
const getAllUsers = async (loggedInUserId) => {
    const query = `
        SELECT oauth_accounts.oauth_id, oauth_accounts.oauth_provider, users.email, users.role_id, roles.name AS role_name
        FROM oauth_accounts
        LEFT JOIN users ON oauth_accounts.user_id = users.id
        LEFT JOIN roles ON users.role_id = roles.id
        WHERE users.id != $1
    `;
    const result = await pool.query(query, [loggedInUserId]);
    return result.rows;
};

// Update a user's role by their OAuth ID
const updateUserRole = async (oauth_id, role_id) => {
    const query = `
        UPDATE users 
        SET role_id = $1 
        WHERE id = (SELECT user_id FROM oauth_accounts WHERE oauth_id = $2) 
        RETURNING id, email, role_id
    `;
    const result = await pool.query(query, [role_id, oauth_id]);
    return result.rows[0];
};

// Delete a user by their OAuth ID
const deleteUserById = async (oauth_id) => {
    const query = `
        DELETE FROM users 
        WHERE id = (SELECT user_id FROM oauth_accounts WHERE oauth_id = $1) 
        RETURNING id, email
    `;
    const result = await pool.query(query, [oauth_id]);
    return result.rows[0];
};

// Export all user-related functions
module.exports = {
    getActiveAccounts,
    getNewUsers,
    getTotalUsers,
    getAllUsers,
    updateUserRole,
    deleteUserById,
};


