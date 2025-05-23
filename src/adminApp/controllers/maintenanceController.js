const maintenanceModel = require('../models/maintenanceModel');

// Controller for maintenance mode settings in the admin app
// Handles fetching and updating maintenance settings

// Get maintenance settings by ID
const getMaintenanceSettings = async (req, res) => {
  try {
    // Extract maintenance settings ID from request parameters
    const id = req.params.id;
    // Fetch settings from the model
    const settings = await maintenanceModel.getMaintenanceSettingsById(id);
    if (!settings) {
      return res.status(404).json({ message: 'Maintenance settings not found' });
    }
    res.json(settings);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update maintenance settings by ID
const updateMaintenanceSettings = async (req, res) => {
  try {
    // Extract ID and new settings from request
    const id = req.params.id;
    const { is_enabled, message, estimated_end } = req.body;
    // Update settings in the model
    const updated = await maintenanceModel.updateMaintenanceSettingsById(id, { is_enabled, message, estimated_end });
    if (!updated) {
      return res.status(404).json({ message: 'Maintenance settings not found' });
    }
    res.json(updated);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export controller functions for use in routes
module.exports = {
  getMaintenanceSettings,
  updateMaintenanceSettings,
};
