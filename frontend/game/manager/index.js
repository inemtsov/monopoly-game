const ELEMENTS = require("./elements");
const roll = require("./roll");
const gameId = require("./gameId");
const updateLogScroll = require("./updateLogScroll");
const updateChatScroll = require("../../chat/updateChatScroll");
const finish = require("./finish");
const userId = require("./userId");
const wantToBuy = require("./wantToBuy");
const initGame = require("./initGame");
const log = require ("./log");
const askProperties = require("./askProperties");
const properties = require("./properties");
const displayHouses = require("./displayHouses");
const requestBuild = require("./requestBuild");
const leaveGame = require("./leaveGame");

let socket = null;

const init = () => {
    socket = require("../communication/index.js")();
};


//build
(() => {
    ELEMENTS.buildModalButton.addEventListener("click", () => {
        $('#buildModal').modal('show');
        $("#buildActionButton").prop('disabled', true);
    });
})();

(() => {
    ELEMENTS.exitButton.addEventListener("click", leaveGame);
})();

(() => {
    ELEMENTS.requestBuild.addEventListener("click", requestBuild);
})();

//Roll
(() => {
    ELEMENTS.rollDice.addEventListener("click", roll);
})();

//Finish
(() => {
    ELEMENTS.finishTurn.addEventListener("click", finish);
})();

//buy
(() => {
    ELEMENTS.buyButton.addEventListener("click", wantToBuy);
})();




//PlayerButtons
/*(() => {
    ELEMENTS.playerButton.addEventListener("click", askProperties);
})();*/

module.exports = {
    init,
    updateLogScroll,
    updateChatScroll,
    //variables
    gameId,
    userId,
    //Socket.emit
    finish,
    requestBuild,
    roll,
    log,
    initGame,
    askProperties,
    properties,
    displayHouses,
    leaveGame,
    wantToBuy: require("./wantToBuy"),
    //Socket.on
    start: require("./start"),
    gameInit: require("./initGame"),
    diceRolled: require("./diceRolled"),
    turnFinished: require("./turnFinished"),
    bought: require("./bought"),
    buy: require("./buy")
};
