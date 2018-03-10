const ELEMENTS = require("../game/manager/elements");

const updateChatScroll = () => {
    ELEMENTS.chat.scrollTop = ELEMENTS.chat.scrollHeight;
};

module.exports = updateChatScroll;
