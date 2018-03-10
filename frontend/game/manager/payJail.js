const gameId = require("./gameId");

const payJail = event => {
    event.preventDefault();
    fetch(`/game/${gameId()}/payJail`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = payJail;
