const express = require('express');
const { firebaseAuth } = require('../controllers/firebaseController');

const router = express.Router();

// POST route for Firebase authentication
router.post('/auth', firebaseAuth);

module.exports = router;
