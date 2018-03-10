const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const authController = require('../controllers/authController');


router.get('/', authController.isLoggedIn, function (request, response) {
    response.render('register');
});


router.post('/cancel', function (request, response) {
    response.redirect('/login');
});

router.post('/create', registerController.createUser);

module.exports = router;
