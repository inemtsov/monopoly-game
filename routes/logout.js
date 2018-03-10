const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
const authController = require('../controllers/authController');

router.get('/', authController.isAuthenticated, logoutController.logout);

module.exports = router;