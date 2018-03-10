const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");
const updatePiecePosition = require("./updatePiecePosition");

const diceMessage = (userName, dieOne, dieTwo) => {
  const container = document.createElement("div");

  const user = document.createElement("b");
  user.textContent = userName;

  container.appendChild(user);
  container.appendChild(
    document.createTextNode(` rolled ${dieOne} and ${dieTwo}`)
  );

  return container;
};

const diceRolled = ({ username, dieOne, dieTwo, newPosition, userid }) => {
  ELEMENTS.rollDice.disabled = true;
  ELEMENTS.diceResult.textContent = `${dieOne} + ${dieTwo}`;
  ELEMENTS.log.appendChild(diceMessage(username, dieOne, dieTwo));
  updateLogScroll();
  updatePiecePosition(username, dieOne, dieTwo, newPosition, userid);
};

module.exports = diceRolled;
