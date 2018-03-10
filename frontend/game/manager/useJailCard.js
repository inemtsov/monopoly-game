const gameId = require("./gameId");

const useJailCard = event => {
    event.preventDefault();
    fetch(`/game/${gameId()}/useJailCard`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = useJailCard;
