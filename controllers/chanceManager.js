const chance = require('../db/chance/index');
const chanceActions = require('./chanceActions');
const GAME_CONSTANTS = require("../src/constants/events");
const gameController = require("../controllers/gameController");

const minChanceId = 0;
const maxChanceId = 24;

// player lands on chance card
// generate random chance card gameId
// retreive chance card from database
// front end: display alert (show description)
// get corresponding chance action
// get chance action parameters
// execute action
const processChanceCard = (userId, gameId, request) => {
//    let {gameId} = request.params;
    let {username} = request.user;

    let chanceCardId = generateRandomChanceCardId();

    // retrieves matching chance card entry from db and executes corresponding action
    // returns result of chance card action execution
    return chance.getChanceCard(chanceCardId)
        .then((chanceCard) => {
            // display modal
            // wait for user to click ok then execute chance action
            let message = " picked a card: \"" + chanceCard.description + "\".";
            request.app
                .get("io")
                .to(`game-${gameId}`)
                .emit(GAME_CONSTANTS.LOG, {
                    username,
                    message
                });
            return executeChanceAction(userId, gameId, chanceCard, request);
        })
        .then((status) => {
            if (status) {
                gameController.startMessage(gameId)
                    .then((players) => {
                        //console.log("Update sent");
                        let {gameId} = request.params;
                        request.app
                            .get("io")
                            .to(`game-${gameId}`)
                            .emit(GAME_CONSTANTS.INIT, {players});
                    });
            }
        })
};

// returns randomly generated chance card gameId
const generateRandomChanceCardId = () => {
    return Math.floor((Math.random() * (maxChanceId - minChanceId) )) + minChanceId;
};

//
const executeChanceAction = (userId, gameId, chanceCard, request) => {

    switch (chanceCard.actionType) {
        case 'collect':
            return chanceActions.collectMoneyFromBank(userId, chanceCard.amount, request);
            break;
        case 'pay':
            return chanceActions.payPot(userId, gameId, chanceCard.amount, request);
            break;
        case 'getOutOfJail':
            return chanceActions.receiveGetOutOfJailFreeCard(userId, request);
            break;
        case 'advance':
            return chanceActions.advanceToBoardSpace(userId, chanceCard.boardPosition, request);
            break;
        default:
            break;
    }
};

module.exports = {processChanceCard};
