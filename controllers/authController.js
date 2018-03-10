const player = require('../db/player/index');


const isAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    } else {
        response.redirect('/');
    }
};

const isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated()) {
        response.redirect('/lobby');
    } else {
        return next();
    }
};

const isAllowedToPlay = (request, response, next) => {

    player.getPlayerGame(request.user.userid)
        .then((game) => {
            if (game) {
                return next();
            } else {
                response.redirect('/lobby');
            }
        })
        .catch((error) => {
            response.redirect('/lobby');
        });

};

module.exports = {
    isAuthenticated,
    isLoggedIn,
    isAllowedToPlay
};