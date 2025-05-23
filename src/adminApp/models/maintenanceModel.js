const db = require('../../config/db'); // import the database connection

// Update maintenance settings by id
const updateMaintenanceSettingsById = async (id, { is_enabled, message, estimated_end }) => {
  const query = `
    UPDATE maintenance_settings
    SET is_enabled = $1, message = $2, estimated_end = $3
    WHERE id = $4
    RETURNING is_enabled, message, estimated_end
  `;
  const values = [is_enabled, message, estimated_end, id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Get maintenance settings by id
const getMaintenanceSettingsById = async (id) => {
  const query = `
    SELECT is_enabled, message, estimated_end
    FROM maintenance_settings
    WHERE id = $1
    LIMIT 1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// Export the model functions for use in controllers and routes
module.exports = {
  getMaintenanceSettingsById,
  updateMaintenanceSettingsById,
};