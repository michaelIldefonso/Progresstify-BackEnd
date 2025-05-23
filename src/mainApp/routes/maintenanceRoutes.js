// Maintenance routes for handling maintenance mode and settings endpoints.
// No authentication required for public GET route.
// Imports controller methods for maintenance settings.

const express = require('express');
const router = express.Router();
const maintenanceController = require('../../adminApp/controllers/maintenanceController');

// Public GET maintenance settings by ID (no admin check)
router.get('/:id', maintenanceController.getMaintenanceSettings);

module.exports = router;
