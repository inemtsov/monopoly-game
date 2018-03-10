const gameId = require("./gameId");

const wantToBuy = event => {
    event.preventDefault();

    const propertyId = $('#property-id').val();
    $('#buyModal').modal('hide');

    fetch(`/game/${gameId()}/buy/${propertyId}`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = wantToBuy;
