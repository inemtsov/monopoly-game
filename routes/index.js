let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (request, response) => {
    response.render('index');
});

router.post('/login', (request, response) => {
    response.redirect('/login');
});

module.exports = router;
