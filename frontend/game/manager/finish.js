const gameId = require("./gameId");
const ELEMENTS = require("./elements");

const finish = event => {
    event.preventDefault();
    ELEMENTS.buildModalButton.disabled = true;
    $(".yourTurn").hide();
    fetch(`/game/${gameId()}/finish`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = finish;
