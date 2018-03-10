const express = require('express');
const router = express.Router();

const createGameController = require('../controllers/createGameController');
const authController = require('../controllers/authController');

router.get('/', authController.isAuthenticated, (request, response) => {
    response.render('createGame');
});

router.post('/create', createGameController.createNewGame);

router.post('/', (request, response) => {
    response.redirect('lobby');
});
module.exports = router;
