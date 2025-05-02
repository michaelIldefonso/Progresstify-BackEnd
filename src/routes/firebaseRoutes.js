const express = require('express');
const { firebaseAuth } = require('../controllers/firebaseController');

const router = express.Router();

// Firebase authentication route
router.post('/firebase-auth', firebaseAuth);

module.exports = router;
