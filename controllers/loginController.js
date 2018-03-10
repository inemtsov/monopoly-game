const passport = require('passport');

module.exports.login = (request, response, next) => {
    passport.authenticate('local', {
        successRedirect: '/lobby',
        failureRedirect: '/login',
        failureFlash: true,
    })(request, response, next);
};