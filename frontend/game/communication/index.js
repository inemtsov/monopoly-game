const GameManager = require("../manager/index");
const CONSTANTS = require("../../../src/constants/events");

const {ROLL_DICE, LOG, USER_JOINED, USER_LEFT, MESSAGE_SEND, FINISH, START, BUY, BOUGHT, INIT, PROPERTIES} = CONSTANTS;

const messageDisplay = require('../../chat/message_display');

const init = () => {
    const id = GameManager.gameId();
    const socket = io();
    //console.log("gameId: " + id);

    socket.emit("join", id);

    socket.on(ROLL_DICE, message => {
        GameManager.diceRolled(message);
    });

    socket.on(LOG, message => {
        GameManager.log(message);
    });

    socket.on(FINISH, message => {
        GameManager.turnFinished(message);
    });

    socket.on(START, message => {
        GameManager.start(message);
    });

    socket.on(INIT, message => {
        GameManager.initGame(message);
    });

    socket.on(BOUGHT, message => {
        GameManager.bought(message);
    });

    socket.on(BUY, message => {
        GameManager.buy(message);
    });

    socket.on(PROPERTIES, message => {
        GameManager.properties(message);
    });

    socket.on(USER_JOINED, messageDisplay.userJoined);
    socket.on(USER_LEFT, messageDisplay.userLeft);
    socket.on(MESSAGE_SEND, messageDisplay.messageReceived);

    $("#chat-area button").click(event => {
        event.preventDefault();
        const message = $("#chat-area input").val();
        $("#chat-area input").val("");

        // socket.emit(MESSAGE_SEND, { timestamp: Date.now(), message });
        socket.emit(MESSAGE_SEND, {timestamp: Date.now(), message, id});

    });

    return socket;
};

module.exports = init;