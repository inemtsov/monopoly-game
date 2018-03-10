const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");
const updatePiecePosition = require("./updatePiecePosition");
const userId = require("./userId");

const startMessage = (userName) => {
    const container = document.createElement("div");

    const user = document.createElement("b");
    user.textContent = userName;

    container.appendChild(user);
    container.appendChild(
        document.createTextNode(` starts playing`)
    );

    return container;
};

const start = ({nextUserId,nextUserUsername}) => {
    if (nextUserId == userId()) {
        //console.log("it's my turn !");
        ELEMENTS.rollDice.disabled = false;
        ELEMENTS.finishTurn.disabled = false;
        $(".yourTurn").show();
    }
    ELEMENTS.log.appendChild(startMessage(nextUserUsername));
    updateLogScroll();
};

module.exports = start;
