const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");
const updatePiecePosition = require("./updatePiecePosition");

const logMessage = ({username, message}) => {
  const container = document.createElement("div");

  const user = document.createElement("b");
  user.textContent = username;

  container.appendChild(user);
  container.appendChild(
    document.createTextNode(` ${message}`)
  );

  return container;
};

const log = (message) => {
  ELEMENTS.log.appendChild(logMessage(message));
  updateLogScroll();
};

module.exports = log;
