const player = require('../db/player/index');
const properties = require('../db/properties/index');
const activeGame = require('../db/activeGame/index');
const gameController = require('../controllers/gameController');
const GAME_CONSTANTS = require("../src/constants/events");
const chanceManager = require("../controllers/chanceManager");
const chanceActions = require('./chanceActions');

const landOnGoCollectAmount = 200;

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

const credit = (userid, amount) => {
    return player.getPlayerGame(userid)
        .then(player => {
            let newAmount = player.money + amount;
            player.creditMoney(userid, newAmount);
            return true;
        })
        .catch((err) => {
            return false;
        })
};

const isInJail = (userid) => {
    // console.log(jailCheck);
    return player.getPlayerGame(userid)
        .then(player => {
            return player.inJail
        })
        .catch((err) => {
            return false;
        })
};

const buy = (request) => {
    const {userid} = request.user;
    const {username} = request.user;
    const {gameId} = request.params;
    const {propertyId} = request.params;
    return player.getPlayerGame(userid)
        .then(playerResult => {
            return properties.findProperty(propertyId)
                .then((property) => {
                    //if players says yes debit him right away
                    let newAmount = playerResult.money - property.cost_to_buy;
                    // console.log(playerResult.money, property.cost_to_buy, newAmount);
                    return player.debitMoney(userid, newAmount)
                        .then((result) => {
                            //create ownedproperty
                            return properties.newOwnedProperty(property.board_position, userid, 0, 0, property.property_group_, gameId)
                                .then((prop) => {
                                    return properties.findOwnedProperties(userid, property.property_group_)
                                        .then(result => {
                                            return properties.getSetNumber(property.board_position)
                                                .then((setResult) => {

                                                    request.app
                                                        .get("io")
                                                        .to(`game-${gameId}`)
                                                        .emit(GAME_CONSTANTS.BOUGHT, {
                                                            username,
                                                            userid,
                                                            property
                                                        });

                                                    gameController.startMessage(gameId)
                                                        .then((players) => {
                                                            //console.log("Update sent");
                                                            request.app
                                                                .get("io")
                                                                .to(`game-${gameId}`)
                                                                .emit(GAME_CONSTANTS.INIT, {players});
                                                        });

                                                    //if group completed
                                                    if (result.length === setResult.setnumber) {
                                                        // console.log(userid, result.property_group_);
                                                        return properties.setOwnedToOne(userid, property.property_group_)
                                                            .then(() => {
                                                                let message = "has a complete group."
                                                                request.app
                                                                    .get("io")
                                                                    .to(`game-${gameId}`)
                                                                    .emit(GAME_CONSTANTS.LOG, {
                                                                        username,
                                                                        message
                                                                    });
                                                                return true
                                                            })
                                                            .catch((err) => {
                                                                return false;
                                                            });
                                                    }
                                                    else {
                                                        let message = "doesn't have a complete group yet."
                                                        request.app
                                                            .get("io")
                                                            .to(`game-${gameId}`)
                                                            .emit(GAME_CONSTANTS.LOG, {
                                                                username,
                                                                message
                                                            });
                                                        return true
                                                    }


                                                })
                                        })
                                        .catch((err) => {
                                            return false;
                                        });
                                })
                                .catch((err) => {
                                    return false;
                                });
                        })
                        .catch((err) => {
                            return false
                        });
                })
                .catch((err) => {
                    return false;
                });
        }).catch((err) => {
            return false;
        });
};

// returns true if player's money < 0 after paying rent
// returns false if player's money >= 0 after paying rent
const payRentToOwner = (renterId, ownerId, rentAmount) => {
    let playerBankrupt = false;

    return player.debitMoneyAuto(renterId, rentAmount)
        .then((renter) => {
            //console.log('renter updated money:', renter.money);
            // message += rentAmount;
            // console.log('message', message);
            // console.log('username', username);
            // console.log('gameId',gameId)
            // sendLog(request, username, message, gameId);

            if (renter.money >= 0) {
                return player.creditMoneyAuto(ownerId, rentAmount);
            } else {
                // bankrupt player
                playerBankrupt = true;
                let bankruptedPlayerRemainingMoney = rentAmount + renter.money;
                // console.log(bankruptedPlayerRemainingMoney);
                return player.creditMoneyAuto(ownerId, bankruptedPlayerRemainingMoney);
            }
        })
        .then((owner) => {
            return playerBankrupt;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
};

const calculateRentAmount = (numberOfBuildings, property) => {
    //console.log('calculating rentAmount');
    // console.log(numberOfBuildings);
    // console.log(property);

    switch (numberOfBuildings) {
        case 0:
            return property.rent_0;
            break;
        case 1:
            return property.rent_1;
            break;
        case 2:
            return property.rent_2;
            break;
        case 3:
            return property.rent_3;
            break;
        case 4:
            return property.rent_4;
            break;
        case 5:
            return property.rent_5;
            break;
    }
}

const defaultCase = (property, request, userid, username, gameId) => {
    return properties.getOwnedProperty(property.board_position, gameId)
        .then(landedOnProperty => {
            if (landedOnProperty == null) {
                //belongs to no one
                //console.log("belongs to no one");
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
                                        //console.log('going to delete player: ' + userid);
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
                                        // console.log("Update sent");
                                        // console.log('players', players)
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

const checkSpaceType = (newPosition, userid, username, request, gameid) => {
    //console.log("Space: " + newPosition);
    return properties.findProperty(newPosition)
        .then(property => {
            switch (property.board_position) {
                // go - collect $400
                case 0:
                    return chanceActions.collectMoneyFromBank(userid, landOnGoCollectAmount, request)
                        .then(() => {
                            let message = "lands on GO and collects $200.";
                            sendLog(request, username, message, gameid);
                            return true;
                        });
                    break;
                // visiting jail
                case 10:
                    //console.log('player is visiting jail, no updates');
                    return true;
                    break;
                // free parking - collect pot
                case 20:
                    return activeGame.getGamePotAmount(gameid)
                        .then((gamePot) => {
                            activeGame.deductMoneyFromPot(gameid, gamePot.pot);
                            return gamePot.pot;
                        })
                        .then((potValue) => {
                            if (potValue > 0) {
                                //console.log('crediting player money with', potValue);
                                return player.creditMoneyAuto(userid, potValue)
                                    .then(() => {
                                        let message = "collected $" + potValue + " from the pot.";
                                        sendLog(request, username, message, gameid);
                                        return true
                                    });
                            }
                            else return true;
                        })
                        .catch((error) => {
                            console.log(error);
                            return false;
                        });
                    break;
                // go to jail
                case 30:
                    return player.putPlayerInJail(userid)
                        .then((updatedJailStatus) => {
                            //console.log('updated jail status:', updatedJailStatus);
                            return player.updatePlayerPosition(userid, 10)
                                .then(() => {
                                    let message = "goes to jail!";
                                    sendLog(request, username, message, gameid);
                                    return true
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            return false;
                        });
                    break;
                // pay income and luxury tax
                case 4:
                case 38:
                    return chanceActions.payPot(userid, gameid, property.fine_, request)
                        .then(() => {
                            let message = "payed $" + property.fine_ + " of tax !";
                            sendLog(request, username, message, gameid);
                        });
                    break;
                // execute chance and community chest card action
                case 2:
                case 7:
                case 17:
                case 22:
                case 33:
                case 36:
                    return chanceManager.processChanceCard(userid, gameid, request);
                    break;
                // property - pay rent or purchase
                default:
                    return defaultCase(property, request, userid, username, gameid);
            }
            return true;
        })

};

const getOwnedProperties = (request, ownerId) => {
    const {userid} = request.user;
    const {username} = request.user;
    const {gameId} = request.params;
    return player.getPlayerUsernameFromUserId(ownerId)
        .then((ownerUsername) => {
            return properties.getOwnedPropertyByUserId(ownerId)
                .then((propertiesList) => {
                    request.app
                        .get("io")
                        .to(`game-${gameId}`)
                        .emit(GAME_CONSTANTS.PROPERTIES, {
                            userid,
                            ownerUsername,
                            propertiesList
                        });
                    return true
                });
        });
};

module.exports = {
    canBeDebited,
    credit,
    isInJail,
    defaultCase,
    buy,
    checkSpaceType,
    getOwnedProperties
};
