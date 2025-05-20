
const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenanceController');
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdminModerator = require('../../middleware/checkAdminModerator');


// GET maintenance settings by ID (admin only)
router.get('/:id', ensureAuthenticated, checkAdminModerator, maintenanceController.getMaintenanceSettings);

// PUT update maintenance settings by ID (admin only)
router.put('/:id', ensureAuthenticated, checkAdminModerator, maintenanceController.updateMaintenanceSettings);

module.exports = router;
