
const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenanceController');
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdmin = require('../../middleware/checkAdmin');


// GET maintenance settings by ID (admin only)
router.get('/:id', ensureAuthenticated, checkAdmin, maintenanceController.getMaintenanceSettings);

// PUT update maintenance settings by ID (admin only)
router.put('/:id', ensureAuthenticated, checkAdmin, maintenanceController.updateMaintenanceSettings);

module.exports = router;
