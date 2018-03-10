const activeGame = require('../db/activeGame/index');
const player = require('../db/player/index');

const validateNewGameConfigurationFields = (request) => {
    request.checkBody('gameName', 'Please enter a game name.').notEmpty();

    return request.validationErrors();
};

module.exports.createNewGame = (request, response, next) => {
    const errors = validateNewGameConfigurationFields(request);

    const {username} = request.user;
    if (errors) {
        response.render('createGame', {errors});
    } else {
        const {gameName, maxPlayers, bankroll} = request.body;
        activeGame.createActiveGame(gameName, maxPlayers, bankroll, true, 1, false)
            .then((game) => {
                player.newGamePlayer(game.gameid, game.startingBankroll, request.user.userid, 0, 0, 0, 1, username).then(() => {
                    response.redirect(`/game/${game.gameid}`);
                })
                    .catch((error) => {
                        request.flash('errors', 'ERROR');
                        response.redirect('/createGame');
                    });
            })

    }
};
