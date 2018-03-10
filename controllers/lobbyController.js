const activeGame = require('../db/activeGame/index');
const player = require('../db/player/index');


const displayActiveGames = (request, response) => {
    activeGame.findActiveGames()
        .then(games => {
            for (let i = 0; i < games.length; i++) {
                player.findNumberOfplayer(games[i].gameid)
                    .then(result => {
                        if (result.length == 0) {
                            activeGame.setGameActive(games[i].gameid, false);
                        }
                    })
                    .catch((err) => {
                        return response.send(err);
                    })
            }
            response.render('lobby', {games});
        }).catch((err) => {
        return response.send(err);
    })
};

const joinGame = (request, response) => {

    const {username} = request.user;

    activeGame.getGame(request.body.joinButton)
        .then(game => {
            if (game.numberOfMaxPlayers > game.numberOfPlayers) {
                player.newGamePlayer(game.gameid, game.startingBankroll, request.user.userid, 0, 0, 0, 0, username)
                    .then(() => {
                        activeGame.addPlayer(request.body.joinButton)
                            .then(game => {
                                if (game.numberOfPlayers == game.numberOfMaxPlayers) {
                                    activeGame.setGameStatus(game.gameid, true);
                                }
                                response.redirect(`/game/${game.gameid}`);
                            })
                            .catch((err) => {
                                return response.send(err);
                            })
                    })
                    .catch((err) => {
                        return response.send(err);
                    })
            } else {
                request.flash('errors', 'This game does not have enough room for a new player!');
                response.redirect('/lobby');
            }
        })
        .catch((err) => {
            return response.send(err);
        })
};

module.exports = {
    displayActiveGames,
    joinGame
};
