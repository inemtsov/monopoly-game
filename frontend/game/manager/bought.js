const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");

const boughtMessage = (userName, name) => {
  const container = document.createElement("div");

  const user = document.createElement("b");
  user.textContent = userName;

  container.appendChild(user);
  container.appendChild(
    document.createTextNode(` bought ${name}`)
  );

  return container;
};

const bought = ({ username, property }) => {
  ELEMENTS.log.appendChild(boughtMessage(username, property.name));
  updateLogScroll();
};

module.exports = bought;
