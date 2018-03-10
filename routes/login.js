const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const authController = require('../controllers/authController');


/* GET home page. */
router.get('/',  authController.isLoggedIn, (request, response) => {
    response.render('login');
});

router.post('/signin',loginController.login);

router.post('/signup',(request, response) => {
    response.redirect('/register');
});

module.exports = router;
