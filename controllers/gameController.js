const activeGame = require('../db/activeGame/index');
const playerDb = require('../db/player/index');
const GAME_CONSTANTS = require("../src/constants/events");

module.exports.getRandomIntInclusive = () => {
    min = Math.ceil(1);
    max = Math.floor(6);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.setPlayerPosition = (gameId, dieOne, dieTwo, request) => {
    return playerDb.getPlayerPosition(gameId)
        .then((player) => {
            return player.position;
        })
        .then((tmpPosition) => {
            let oldPosition = tmpPosition;
            tmpPosition += dieOne + dieTwo;
            //console.log("before substraction: " + tmpPosition);
            //Pass by GO
            if (tmpPosition > 39) {
                tmpPosition = tmpPosition - 40;
                if (oldPosition != 30) {
                    playerDb.creditMoneyAuto(gameId, 200)
                        .then(() => {
                            const {gameId} = request.params;
                            const {username} = request.user;
                            let message = "passed go and collected $200";
                            request.app
                                .get("io")
                                .to(`game-${gameId}`)
                                .emit(GAME_CONSTANTS.LOG, {
                                    username,
                                    message
                                });
                            return true;
                        })
                }
            }
            playerDb.updatePlayerPosition(gameId, tmpPosition);
            return tmpPosition;
        })
        .catch((err) => {
            return false;
        });
};

module.exports.nextTurn = (userId, gameId) => {
    return playerDb.nextPlayer(userId, gameId)
        .then((nextUserId) => {
            //set turn change
            return playerDb.changeTurnRight(userId, nextUserId)
                .then(() => {
                    return playerDb.findPlayerById(nextUserId);
                })
                .catch((err) => {
                    return false;
                });
        })
        .catch((err) => {
            return false;
        });
};

module.exports.isAllowedToRoll = (gameId, userId) => {
    //get the player gameId according userid
    //check if playerid belongs roomid table
    //check if playerid in roomid has roll rights

};

module.exports.startMessage = (gameId) => {
    return playerDb.getPlayerFromGame(gameId)
        .then((players) => {
            return players;
        });
};

module.exports.loadProperties = () => {
    return activeGame.getProperties()
        .then((properties) => {
            return properties;
        })
        .catch((error) => {
            //	console.log("dead");
        });

};

module.exports.buildProcessInit = (userid) => {
    return activeGame.getPropertiesBuildable(userid)
        .then((properties) => {
            return properties;
        })
        .catch((error) => {
            //	console.log("dead");
        });
};