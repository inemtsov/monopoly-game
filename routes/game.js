const express = require("express");
const router = express.Router();

const GAME_CONSTANTS = require("../src/constants/events");

const gameController = require("../controllers/gameController");
const authController = require("../controllers/authController");
const gameLogic = require("../controllers/gameLogic");

const playerDb = require("../db/player/index");
const propertiesDb = require("../db/properties/index");
const propertiesDB = require("../db/properties/index");
const activeGamesDb = require("../db/activeGame/index");

router.get("/:gameId", authController.isAllowedToPlay, (request, response) => {
    const {gameId} = request.params;
    const {userid} = request.user;

    //response.render("game", {gameId, userid});
    let navBarDisabled = 1;
    gameController.loadProperties()
        .then((properties) => {
            response.render("game", {gameId, userid, properties, navBarDisabled});
        });
});

router.post(
    "/:gameId/buy/:propertyId",
    authController.isAllowedToPlay,
    (request, response) => {
        gameLogic.buy(request)
            .then((status) => {
                if (status) {
                    return response.sendStatus(202);
                }
                else {
                    return response.sendStatus(204);
                }
            });
    }
);

router.post(
    "/:gameId/getProperties/:ownerId",
    authController.isAllowedToPlay,
    (request, response) => {
        const {ownerId} = request.params;
        return gameLogic.getOwnedProperties(request, ownerId)
            .then((status) => {
                if (status) {
                    return response.sendStatus(202);
                }
                else {
                    return response.sendStatus(204);
                }
            });
    }
);

router.post(
    "/:gameId/build/:propertyId/:housesToBuild",
    authController.isAllowedToPlay,
    (request, response) => {
        const {propertyId} = request.params;
        const {gameId} = request.params;
        const {userid} = request.user;
        const {housesToBuild} = request.params;
        const {username} = request.user;

        return propertiesDB.getHouseCost(propertyId)
            .then((houseCost) => {
                let toBeDebited = houseCost.house_cost * housesToBuild;
                return playerDb.getPlayerMoney(userid)
                    .then((currentAmount) => {
                        //can be debited
                        if (currentAmount.money - toBeDebited > 0) {
                            return playerDb.debitMoneyAuto(userid, toBeDebited)
                                .then((remainingMoney) => {
                                    return propertiesDB.buildHouses(propertyId, housesToBuild, userid)
                                        .then((prop) => {
                                            let message = " built " + housesToBuild + " houses.";
                                            request.app
                                                .get("io")
                                                .to(`game-${gameId}`)
                                                .emit(GAME_CONSTANTS.LOG, {
                                                    username,
                                                    message
                                                });
                                            return gameController.buildProcessInit(userid)
                                                .then((propertiesBuildable) => {
                                                    gameController.startMessage(gameId)
                                                        .then((players) => {
                                                            request.app
                                                                .get("io")
                                                                .to(`game-${gameId}`)
                                                                .emit(GAME_CONSTANTS.INIT, {players, propertiesBuildable});
                                                        });
                                                    return response.sendStatus(202);
                                                });
                                        })
                                })
                        }
                        else {
                            let message = " doesn't have enough money to build houses.";
                            request.app
                                .get("io")
                                .to(`game-${gameId}`)
                                .emit(GAME_CONSTANTS.LOG, {
                                    username,
                                    message
                                });
                            return response.sendStatus(202);
                        }
                    })
            });
    }
);

router.post(
    "/:gameId/payJail",
    authController.isAllowedToPlay,
    (request, response) => {
        const {gameId} = request.params;
        const {username} = request.user;
        const {userid} = request.user;
        return playerDb.inJail(userid, 0)
            .then(() => {
                return playerDb.debitMoneyAuto(userid, 50)
                    .then(() => {
                        return playerDb.hasRolled(userid, 1)
                            .then((res) => {
                                let message = " payed $50 to get out of jail.";
                                request.app
                                    .get("io")
                                    .to(`game-${gameId}`)
                                    .emit(GAME_CONSTANTS.LOG, {
                                        username,
                                        message
                                    });
                                gameController.startMessage(gameId)
                                    .then((players) => {
                                        request.app
                                            .get("io")
                                            .to(`game-${gameId}`)
                                            .emit(GAME_CONSTANTS.INIT, {players});
                                    });
                                return true
                            });
                    })
            })
    }
);

router.post(
    "/:gameId/useJailCard",
    authController.isAllowedToPlay,
    (request, response) => {
        const {gameId} = request.params;
        const {username} = request.user;
        const {userid} = request.user;
        return playerDb.inJail(userid, 0)
            .then(() => {
                return playerDb.jailCardUsed(userid)
                    .then(() => {
                        return playerDb.hasRolled(userid, 1)
                            .then(() => {
                                let message = " used a get out of jail card.";
                                request.app
                                    .get("io")
                                    .to(`game-${gameId}`)
                                    .emit(GAME_CONSTANTS.LOG, {
                                        username,
                                        message
                                    });
                                gameController.startMessage(gameId)
                                    .then((players) => {
                                        request.app
                                            .get("io")
                                            .to(`game-${gameId}`)
                                            .emit(GAME_CONSTANTS.INIT, {players});
                                    });
                                return true
                            });
                    })
            })
    }
);

router.post(
    "/:gameId/roll",
    authController.isAllowedToPlay,
    (request, response) => {

        const {gameId} = request.params;
        const {username} = request.user;
        const {userid} = request.user;
        playerDb.findActivePlayerById(userid)
            .then(player => {
                if (player.gameid == gameId) {
                    if (player.isTurn == 1) {
                        const dieOne = gameController.getRandomIntInclusive();
                        const dieTwo = gameController.getRandomIntInclusive();
                        //let dieOne = 1;
                        //let dieTwo = 0;
                        if (player.inJail === 0) {
                            return gameController.setPlayerPosition(userid, dieOne, dieTwo, request)
                                .then((newPosition) => {
                                    request.app
                                        .get("io")
                                        .to(`game-${gameId}`)
                                        .emit(GAME_CONSTANTS.ROLL_DICE, {
                                            username,
                                            dieOne,
                                            dieTwo,
                                            newPosition,
                                            userid
                                        });

                                    //set user has rolled
                                    //DEVELOPMENT !!
                                    return playerDb.hasRolled(userid, 1)
                                        .then((res) => {
                                            // Update game state?
                                            return gameLogic.checkSpaceType(newPosition, userid, username, request, gameId)
                                                .then((res) => {
                                                    if (res) {
                                                        //start res true
                                                        activeGamesDb.addMoneyToPot(gameId, 0)
                                                            .then((gamePot) => {
                                                                //console.log("game pot amount: " + gamePot.pot);
                                                                let pot = gamePot.pot;
                                                                return gameController.startMessage(gameId)
                                                                    .then((players) => {
                                                                        request.app
                                                                            .get("io")
                                                                            .to(`game-${gameId}`)
                                                                            .emit(GAME_CONSTANTS.INIT, {
                                                                                players,
                                                                                pot,
                                                                            });
                                                                    });
                                                            });
                                                        return response.sendStatus(202);
                                                    }//end is res true
                                                    else return response.sendStatus(204);
                                                })
                                        })
                                })
                        }
                        //in jail
                        else {
                            //in jail ask for things to do
                            if (dieOne == dieTwo) {
                                return playerDb.inJail(userid, 0)
                                    .then(() => {
                                        return playerDb.hasRolled(userid, 1)
                                            .then((res) => {
                                                let message = " exits jail thanks to a double of " + dieOne;
                                                request.app
                                                    .get("io")
                                                    .to(`game-${gameId}`)
                                                    .emit(GAME_CONSTANTS.LOG, {
                                                        username,
                                                        message
                                                    });
                                                gameController.startMessage(gameId)
                                                    .then((players) => {
                                                        request.app
                                                            .get("io")
                                                            .to(`game-${gameId}`)
                                                            .emit(GAME_CONSTANTS.INIT, {players});
                                                    });
                                                return true
                                            });
                                    })
                            }
                            else {
                                let message = " sorry you rolled " + dieOne + " and " + dieTwo;
                                request.app
                                    .get("io")
                                    .to(`game-${gameId}`)
                                    .emit(GAME_CONSTANTS.LOG, {
                                        username,
                                        message
                                    });
                                return playerDb.hasRolled(userid, 1)
                                    .then((res) => {
                                        return gameController.startMessage(gameId)
                                            .then((players) => {
                                                request.app
                                                    .get("io")
                                                    .to(`game-${gameId}`)
                                                    .emit(GAME_CONSTANTS.INIT, {players});
                                                return true;
                                            });

                                    });

                            }
                        }

                    }
                    else return response.sendStatus(204);
                }
                else return response.sendStatus(204);
            })
            .catch((err) => {
                return response.sendStatus(204);
            });
    });

router.post(
    "/:gameId/finish",
    authController.isAllowedToPlay,
    (request, response) => {
        const {gameId} = request.params;
        const {username} = request.user;
        const {userid} = request.user;

        playerDb.findActivePlayerById(userid)
            .then(player => {
                playerDb.hasRolled(userid, 0)
                    .then(() => {
                        if (player.gameid == gameId) {
                            if (player.isTurn == 1) {
                                request.app
                                    .get("io")
                                    .to(`game-${gameId}`)
                                    .emit(GAME_CONSTANTS.FINISH, {
                                        username
                                    });

                                //get new user turn
                                return gameController.nextTurn(userid, gameId)
                                    .then((nextUser) => {
                                        let nextUserId = nextUser.userid;
                                        let nextUserUsername = nextUser.username;
                                        request.app
                                            .get("io")
                                            .to(`game-${gameId}`)
                                            .emit(GAME_CONSTANTS.START, {
                                                nextUserId,
                                                nextUserUsername
                                            });
                                        return gameController.buildProcessInit(nextUserId)
                                            .then((propertiesBuildable) => {
                                                return gameController.startMessage(gameId)
                                                    .then((players) => {
                                                        request.app
                                                            .get("io")
                                                            .to(`game-${gameId}`)
                                                            .emit(GAME_CONSTANTS.INIT, {players, propertiesBuildable});
                                                        return response.sendStatus(202);
                                                    });
                                            })
                                    })

                                    .catch((err) => {
                                        return response.sendStatus(204);
                                    });
                            }
                            else return response.sendStatus(204);

                        } else return response.sendStatus(204);

                    })
            })
            .catch((err) => {
                return response.sendStatus(204);
            });
        // Update game state?
    });

router.get("/", authController.isAuthenticated, (request, response) => {
    response.redirect("/lobby");
});

router.post("/", (request, response) => {
    response.redirect("/lobby");
});

router.post("/:gameId/exit", (request, response) => {
    const {userid} = request.user;
    const {gameId} = request.params;
    let {username} = request.user;
    let bankrupted = request.user.username;
    // maybe alert player has bankrupted?
    //get new user turn
    return gameController.nextTurn(userid, gameId)
        .then((nextUser) => {
            let nextUserId = nextUser.userid;
            let nextUserUsername = nextUser.username;
            request.app
                .get("io")
                .to(`game-${gameId}`)
                .emit(GAME_CONSTANTS.START, {
                    nextUserId,
                    nextUserUsername
                });
            return propertiesDb.deletePlayerOwnedProperties(userid)
                .then(() => {
                    return playerDb.deletePlayerFromPlayers(userid)
                        .then(() => {
                            gameController.startMessage(gameId)
                                .then((players) => {
                                    let bankrupt = userid;
                                    request.app
                                        .get("io")
                                        .to(`game-${gameId}`)
                                        .emit(GAME_CONSTANTS.INIT, {players, bankrupt});

                                    let message = bankrupted + " bankrupted !";
                                    username = "Game";
                                    request.app
                                        .get("io")
                                        .to(`game-${gameId}`)
                                        .emit(GAME_CONSTANTS.LOG, {
                                            username,
                                            message
                                        });
                                });
                            return true;
                        })
                })
        })
});

module.exports = router;
