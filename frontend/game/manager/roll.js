const gameId = require("./gameId");

const roll = event => {
    event.preventDefault();

    fetch(`/game/${gameId()}/roll`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = roll;
