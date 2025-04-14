const pool = require('../../config/db');

// Queries specific to adminApp
const getActiveAccounts = async () => {
    const query = `
        SELECT COUNT(*) AS active_accounts 
        FROM users 
        WHERE last_active >= NOW() - INTERVAL '7 days'
    `;
    const result = await pool.query(query);
    return result.rows[0].active_accounts;
};

const getNewUsers = async () => {
    const query = `
        SELECT COUNT(*) AS new_users 
        FROM users 
        WHERE created_at >= NOW() - INTERVAL '30 days'
    `;
    const result = await pool.query(query);
    return result.rows[0].new_users;
};

const getTotalUsers = async () => {
    const query = `
        SELECT COUNT(*) AS total_users 
        FROM users
    `;
    const result = await pool.query(query);
    return result.rows[0].total_users;
};

// Fetch all users
const getAllUsers = async () => {
    const query = `
        SELECT users.id, users.email, users.role_id, roles.name AS role_name
        FROM users
        LEFT JOIN roles ON users.role_id = roles.id
    `;
    const result = await pool.query(query);
    return result.rows;
};

// Update user role
const updateUserRole = async (id, role_id) => {
    const query = `
        UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, email, role_id
    `;
    const result = await pool.query(query, [role_id, id]);
    return result.rows[0];
};

// Delete user
const deleteUserById = async (id) => {
    const query = `
        DELETE FROM users WHERE id = $1 RETURNING id, email
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    getActiveAccounts,
    getNewUsers,
    getTotalUsers,
    getAllUsers,
    updateUserRole,
    deleteUserById,
};


