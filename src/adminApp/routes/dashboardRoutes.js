const express = require('express');
const router = express.Router();

// Middleware imports
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdminModerator = require('../../middleware/checkAdminModerator');

// Controller imports
const {
    fetchActiveAccounts,
    fetchNewUsers,
    fetchTotalUsers,
    fetchDailyMetricsController,
} = require('../controllers/dashboardController');

// Apply common middlewares to all routes
router.use(ensureAuthenticated, checkAdminModerator);

// Route handlers
router.get('/charts/daily-metrics', fetchDailyMetricsController);
router.get('/charts/active-accounts', fetchActiveAccounts);
router.get('/charts/new-users', fetchNewUsers);
router.get('/charts/total-users', fetchTotalUsers);

module.exports = router;
