const express = require('express');
const router = express.Router();
const maintenanceController = require('../../adminApp/controllers/maintenanceController');

// Public GET maintenance settings by ID (no admin check)
router.get('/:id', maintenanceController.getMaintenanceSettings);

module.exports = router;
