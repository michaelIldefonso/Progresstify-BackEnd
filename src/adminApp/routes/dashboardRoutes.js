const express = require('express');
const router = express.Router();

// Middleware imports
const ensureAuthenticated = require('../../middleware/authMiddleware');
const checkAdmin = require('../../middleware/checkAdmin');

// Controller imports
const {
    fetchActiveAccounts,
    fetchNewUsers,
    fetchTotalUsers,
} = require('../controllers/dashboardController');

// Route to get the count of active accounts
router.get('/charts/active-accounts', ensureAuthenticated, checkAdmin, fetchActiveAccounts);

// Route to get the count of new users
router.get('/charts/new-users', ensureAuthenticated, checkAdmin, fetchNewUsers);

// Route to get the total number of users
router.get('/charts/total-users', ensureAuthenticated, checkAdmin, fetchTotalUsers);

module.exports = router;
