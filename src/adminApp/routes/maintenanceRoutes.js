const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenanceController');
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdminModerator = require('../../middleware/checkAdminModerator');

// Apply common middlewares to all routes
router.use(ensureAuthenticated, checkAdminModerator);

// Route handlers
router.get('/:id', maintenanceController.getMaintenanceSettings);
router.put('/:id', maintenanceController.updateMaintenanceSettings);

module.exports = router;
