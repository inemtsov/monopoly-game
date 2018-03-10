import {
    LOBBY,
    USER_JOINED,
    USER_LEFT,
    MESSAGE_SEND,
    USER_TYPING
} from "../src/constants/events";

import {
    appendMessage,
    messageElement,
    timestampElement,
    userElement,
    userJoined,
    userLeft,
    messageReceived,
} from "./chat/message_display";

let users = [];

const id = 0;
const socket = io();
socket.emit("join", id);

let $chatContainer = $('.chat-container');
$chatContainer[0].scrollTop = $chatContainer[0].scrollHeight;

$(document).ready(() => {
    socket.on(USER_JOINED, userJoined);
    socket.on(USER_LEFT, userLeft);
    socket.on(MESSAGE_SEND, messageReceived);
    //socket.on(USER_TYPING, userTyping);

    $("#chat-area button").click(event => {
        event.preventDefault();
        const message = $("#chat-area input").val();
        $("#chat-area input").val("");

        socket.emit(MESSAGE_SEND, {timestamp: Date.now(), message, id});
        updateChatScroll();
    })
});

function updateChatScroll() {
    $chatContainer[0].scrollTop = $chatContainer[0].scrollHeight;
}
