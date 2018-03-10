const ELEMENTS = require("./elements");

const updateLogScroll = () => {
  ELEMENTS.log.scrollTop = ELEMENTS.log.scrollHeight;
};

module.exports = updateLogScroll;
