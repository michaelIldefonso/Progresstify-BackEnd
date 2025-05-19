
const maintenanceModel = require('../models/maintenanceModel');

// Get maintenance settings by ID
const getMaintenanceSettings = async (req, res) => {
  try {
    const id = req.params.id;
    const settings = await maintenanceModel.getMaintenanceSettingsById(id);
    if (!settings) {
      return res.status(404).json({ message: 'Maintenance settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update maintenance settings by ID
const updateMaintenanceSettings = async (req, res) => {
  try {
    const id = req.params.id;
    const { is_enabled, message, estimated_end } = req.body;
    const updated = await maintenanceModel.updateMaintenanceSettingsById(id, { is_enabled, message, estimated_end });
    if (!updated) {
      return res.status(404).json({ message: 'Maintenance settings not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMaintenanceSettings,
  updateMaintenanceSettings,
};
