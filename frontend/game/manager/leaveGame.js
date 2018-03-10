const gameId = require("./gameId");

const leaveGame = event => {
    event.preventDefault();

    fetch(`/game/${gameId()}/exit`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = leaveGame;
