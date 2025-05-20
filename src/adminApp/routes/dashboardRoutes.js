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
// Route to get daily metrics (charts)
router.get('/charts/daily-metrics', ensureAuthenticated, checkAdminModerator, fetchDailyMetricsController);

// Route to get the count of active accounts
router.get('/charts/active-accounts', ensureAuthenticated, checkAdminModerator, fetchActiveAccounts);

// Route to get the count of new users
router.get('/charts/new-users', ensureAuthenticated, checkAdminModerator, fetchNewUsers);

// Route to get the total number of users
router.get('/charts/total-users', ensureAuthenticated, checkAdminModerator, fetchTotalUsers);

module.exports = router;
