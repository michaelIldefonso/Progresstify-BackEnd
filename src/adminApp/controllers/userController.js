const pool = require('../../config/db'); // Assuming `db.js` exports the PostgreSQL pool

export const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.email, r.name AS role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};