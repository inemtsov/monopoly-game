const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const lobbyController = require('../controllers/lobbyController');


router.get('/', authController.isAuthenticated, lobbyController.displayActiveGames);

router.post('/create', (request, response) => {
    response.redirect('/createGame');
});

router.post('/finish', (request, response) => {
    response.redirect('/lobby');
});


router.post('/join', lobbyController.joinGame);

module.exports = router;
