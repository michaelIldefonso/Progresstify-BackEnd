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

module.exports = {
    getActiveAccounts,
    getNewUsers,
    getTotalUsers,
};
