const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");
const updatePiecePosition = require("./updatePiecePosition");
const userId = require("./userId");

const buyMessage = (username, property) => {
    const container = document.createElement("div");
    const user = document.createElement("b");
    user.textContent = username;

    container.appendChild(user);

    container.appendChild(
        document.createTextNode(` ${username} looking for  ${property.name}`)
    );

    return container;
};

const buy = ({username, userid, property}) => {
    if (userid == userId()) {
        //console.log("prop: " + property.board_position);
        $('#buyModal').modal('show');
        $('#property-id').val(property.board_position);
        $('#buyModal .modal-title').text('Do you want to buy ' + property.name + ' for $' + property.cost_to_buy);
    }
    ELEMENTS.log.appendChild(buyMessage(username, property));
    updateLogScroll();
};

module.exports = buy;
