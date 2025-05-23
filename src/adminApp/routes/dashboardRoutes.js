const express = require('express');
const router = express.Router();

// Middleware imports
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdminModerator = require('../../middleware/checkAdminModerator');

// Controller imports
const dashboardController = require('../controllers/dashboardController');

// Apply common middlewares to all routes
router.use(ensureAuthenticated, checkAdminModerator);

// Route handlers
router.get('/charts/daily-metrics', dashboardController.fetchDailyMetricsController);
router.get('/charts/active-accounts', dashboardController.fetchActiveAccounts);
router.get('/charts/new-users', dashboardController.fetchNewUsers);
router.get('/charts/total-users', dashboardController.fetchTotalUsers);

module.exports = router;
