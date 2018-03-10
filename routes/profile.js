const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const imageUploadController = require('../controllers/imageUploadController');


router.get('/', authController.isAuthenticated, profileController.loadInfo);

router.post('/lobby', (request, response) => {
    response.redirect('/lobby');
});

router.post('/delete', profileController.deleteAccount);

router.post('/save', profileController.update);

router.post('/upload', imageUploadController.uploadAvatar);

module.exports = router;
