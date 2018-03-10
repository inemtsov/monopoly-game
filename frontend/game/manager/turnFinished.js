const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");
const updatePiecePosition = require("./updatePiecePosition");
const userId = require("./userId");

const finishMessage = (userName) => {
    const container = document.createElement("div");

    const user = document.createElement("b");
    user.textContent = userName;

    container.appendChild(user);
    container.appendChild(
        document.createTextNode(` finished his turn `)
    );

    return container;
};

const turnFinished = ({ username }) => {
    ELEMENTS.finishTurn.disabled = true;
    ELEMENTS.rollDice.disabled = true;
    ELEMENTS.log.appendChild(finishMessage(username));
    updateLogScroll();
};

module.exports = turnFinished;
