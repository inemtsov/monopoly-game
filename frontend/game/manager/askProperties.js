const gameId = require("./gameId");
const userId = require("./userId");

const askProperties = event => {
    event.preventDefault();
    let ownerId = event.target.value;
    //console.log("button data triggered: " + ownerId);

    fetch(`/game/${gameId()}/getProperties/${ownerId}`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = askProperties;
