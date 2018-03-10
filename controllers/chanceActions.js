const player = require('../db/player/index');
const activeGame = require('../db/activeGame/index');
const gameController = require("../controllers/gameController");
const GAME_CONSTANTS = require("../src/constants/events");
const properties = require("../db/properties/index");

const passGoCollectAmount = 200;

// updates player's money
// returns true for successful update
// return false for failed update
const collectMoneyFromBank = (userId, amount, request) => {
    // returns player's updated money
    return player.creditMoneyAuto(userId, amount)
        .then((updatedMoney) => {
            // alert player money was credited
            // wait for player to click ok
            // end turn
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
};

// updates player's money and game's pot
// returns true for successful update
// return false for failed update
const payPot = (userId, gameId, amount, request) => {
    //const {gameId} = request.params;

    //console.log('paying pot');
    let playerBankrupt = false;
    // returns player's updated money
    return player.debitMoneyAuto(userId, amount)
        .then((updatedMoney) => {
            if (updatedMoney.money >= 0) {
                // returns updated pot amount
                return activeGame.addMoneyToPot(gameId, amount);
            } else {
                // handle player bankrupt here?
                playerBankrupt = true;
                let remainingMoney = amount + updatedMoney.money;
                return activeGame.addMoneyToPot(gameId, remainingMoney);
            }
        })
        .then((gamePot) => {

            return gameController.startMessage(gameId)
                .then((players) => {
                    let {gameId} = request.params;
                    let pot = gamePot.pot;
                    request.app
                        .get("io")
                        .to(`game-${gameId}`)
                        .emit(GAME_CONSTANTS.INIT, {players, pot});

                    if (playerBankrupt) {
                        //Gameover function
                        // maybe alert player has bankrupted?
                        //get new user turn
                        return gameController.nextTurn(userId, gameId)
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
                                return properties.deletePlayerOwnedProperties(userId)
                                    .then(() => {
                                        return player.deletePlayerFromPlayers(userId)
                                            .then(() => {
                                                gameController.startMessage(gameId)
                                                    .then((players) => {
                                                        //console.log("Update sent");
                                                        let bankrupt = userId;
                                                        request.app
                                                            .get("io")
                                                            .to(`game-${gameId}`)
                                                            .emit(GAME_CONSTANTS.INIT, {players, bankrupt});

                                                        let message = username + " bankrupted !";
                                                        let username = "Game";

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
                    } else {
                        // end turn
                        return true;
                    }
                });
        })
        .catch((error) => {
            console.log(error);
            // end turn
            return false;
        });
};

// updates player's number of get out of jail free cards
// returns true for successful update
// return false for failed update
const receiveGetOutOfJailFreeCard = (userId, request) => {
    let {gameId} = request.params;
    let {username} = request.user;
    // returns updated player's number of get out of jail free cards
    return player.incremementGetOutOfJailFreeCard(userId)
        .then((updatedJailFreeCardsAmount) => {
            let message = " you just got one get out of jail card !";
            request.app
                .get("io")
                .to(`game-${gameId}`)
                .emit(GAME_CONSTANTS.LOG, {
                    username,
                    message
                });
            gameController.startMessage(gameId)
                .then((players) => {
                    let {gameId} = request.params;
                    request.app
                        .get("io")
                        .to(`game-${gameId}`)
                        .emit(GAME_CONSTANTS.INIT, {players});
                });
            // alert player with updated jail free cards
            // wait for player to click ok
            // end turns
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
};

// updates player's position and possibly owned properties
// returns true for successful update
// return false for failed update
const advanceToBoardSpace = (userId, destinationBoardPosition, request) => {
    let {username} = request.user;
    let {gameId} = request.params;
    switch (destinationBoardPosition) {
        // jail
        case 10:
            return player.putPlayerInJail(userId)
                .then((updatedJailStatus) => {
                    return player.updatePlayerPosition(userId, destinationBoardPosition)
                })
                .then((updatedPlayerPosition) => {
                    // end turn
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    return false;
                });
            break;
        // go
        case 0:
            return player.creditMoneyAuto(userId, passGoCollectAmount)
                .then((updatedPlayerMoney) => {
                    //console.log('updated player money:', updatedPlayerMoney.money);
                    return player.updatePlayerPosition(userId, destinationBoardPosition)
                })
                .then((updatedPlayerPosition) => {
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    return false;
                });
            break;
        // property - prompt if player wants to purchase if unowned
        default:
            //console.log('advancing player to a property');
            // check if pass go after advancing to new board position; collect 200 if yes
            return player.getPlayerPosition(userId)
                .then((playerPosition) => {
                    if (playerPosition.position >= destinationBoardPosition) {
                        return player.creditMoneyAuto(userId, passGoCollectAmount);
                    } else {
                        return player.getPlayerMoney(userId);
                    }
                })
                .then((playerMoney) => {
                    return player.updatePlayerPosition(userId, destinationBoardPosition);
                })
                .then((updatedPlayer) => {
                    return updatedPlayer;
                })
                .then((updatedPlayer) => {
                    return properties.findProperty(updatedPlayer.position)
                        .then((property) => {
                            return checkSpaceTypeAfterChance(property, request, userId, username, gameId)
                                .then(() => {
                                    return true
                                })
                        })

                })
                .then(() => {
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    return false;
                });
            break;
    }
};

const checkSpaceTypeAfterChance = (property, request, userid, username, gameId) => {
    //console.log("default case");
    return properties.getOwnedProperty(property.board_position, gameId)
        .then(landedOnProperty => {
            if (landedOnProperty == null) {
                //belongs to no one
                return canBeDebited(userid, property.cost_to_buy)
                    .then((canBeDebit) => {
                        if (canBeDebit) {
                            //prompt to buy
                            request.app
                                .get("io")
                                .to(`game-${gameId}`)
                                .emit(GAME_CONSTANTS.BUY, {
                                    username,
                                    userid,
                                    property
                                });
                            return true;
                        } else {
                            //not enough money
                            let message = "doesn't have enough money to get " + property.name;
                            request.app
                                .get("io")
                                .to(`game-${gameId}`)
                                .emit(GAME_CONSTANTS.LOG, {
                                    username,
                                    message
                                });
                            return true;
                        }
                    })
                    .catch(err => {
                        return false
                    });
            }
            else {
                //Is it my property ?
                if (landedOnProperty.userid === userid) {
                    let message = "welcome home !";
                    request.app
                        .get("io")
                        .to(`game-${gameId}`)
                        .emit(GAME_CONSTANTS.LOG, {
                            username,
                            message
                        });
                    return true;
                }
                //I m at someone space
                else {
                    //console.log('another player owns this property:', landedOnProperty.userid);

                    let message = '';
                    // new stuff
                    return player.getPlayerUsernameFromUserId(landedOnProperty.userid)
                        .then((owner) => {
                            message = "welcome to " + owner.username + "'s place ! The rent is $";
                            return calculateRentAmount(landedOnProperty.numberOfBuildings, property);
                        })
                        .then((rentAmount) => {
                            message += rentAmount;
                            sendLog(request, username, message, gameId);
                            return payRentToOwner(userid, landedOnProperty.userid, rentAmount);
                        })
                        .then((playerBankrupt) => {
                            if (playerBankrupt) {
                                //Gameover function
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
                                        return properties.deletePlayerOwnedProperties(userid)
                                            .then(() => {
                                                return player.deletePlayerFromPlayers(userid)
                                                    .then(() => {
                                                        gameController.startMessage(gameId)
                                                            .then((players) => {
                                                                let bankrupt = userid;
                                                                request.app
                                                                    .get("io")
                                                                    .to(`game-${gameId}`)
                                                                    .emit(GAME_CONSTANTS.INIT, {players, bankrupt});

                                                                let message = username + " bankrupted !";
                                                                let username = "Game";

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
                                //gameover function
                            }
                            else {
                                gameController.startMessage(gameId)
                                    .then((players) => {
                                        request.app
                                            .get("io")
                                            .to(`game-${gameId}`)
                                            .emit(GAME_CONSTANTS.INIT, {players});
                                    });
                            }
                            return true;
                        });
                } // someone else, else
            } // end property is owned
        })
        .catch((err) => {
            return false;
        });
};

const canBeDebited = (userid, amount) => {
    return player.getPlayerGame(userid)
        .then(player => {
            let newAmount = player.money - amount;
            if (newAmount >= 0) {
                return true
            }
            else return false;
        })
        .catch((err) => {
            return false;
        })
};

const sendLog = (request, username, message, gameId) => {
    request.app
        .get("io")
        .to(`game-${gameId}`)
        .emit(GAME_CONSTANTS.LOG, {
            username,
            message
        });
    return true;
};

module.exports = {
    collectMoneyFromBank,
    payPot,
    receiveGetOutOfJailFreeCard,
    advanceToBoardSpace
};
