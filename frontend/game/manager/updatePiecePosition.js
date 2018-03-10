const ELEMENTS = require("./elements");

const updatePiecePosition = (username, dieOne, dieTwo, newPosition, userid) => {

    let prevPosition = newPosition - dieOne - dieTwo;
    if (prevPosition < 0 ) prevPosition += 40;

    let previousDivId = "#" + prevPosition + " .hallway #id" + userid;
    let newDivId = "#" + newPosition + " .hallway";

    $(previousDivId).remove();
    if (username.length > 5) username = username.substring(0, 5);
    $(newDivId).append(
        '<b id="id' + userid  + '" style="solid 2px black;">' + username + '</br></b>'
    );
};

module.exports = updatePiecePosition;
