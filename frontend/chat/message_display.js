import moment from "moment";

const updateChatScroll = require("./updateChatScroll");

const appendMessage = message => {
    $('.messages').append(message);
};

const messageElement = ({timestamp, user, message}) =>
    $('<div>', {class: 'message'})
        .text(message)
        .prepend(timestampElement(timestamp), userElement(user));

const timestampElement = time => {
    const element = $('<time>', {
        class: 'timeago',
        datetime: moment(time).format()
    }).text(moment(time).format('hh:mm:ss'));

    return element[0]
};

const userElement = userName =>
    $('<span>', {class: 'user'}).text(userName)[0];

const userJoined = data => {
    appendMessage(messageElement(Object.assign(data, {message: ' joined'})));
    $(".users").html(data.users.join("<br/>"));
    //$(".users").append(data.users.join("<br/>"));
};

const userLeft = ({user, users}) => {
    appendMessage(messageElement({user, message: " left"}));
    $(".users").html(users.join("<br/>"));
};

const messageReceived = data => {
    appendMessage(messageElement(Object.assign(data, {user: `${data.user} said`})));
    updateChatScroll();
};

export {
    appendMessage,
    messageElement,
    timestampElement,
    userElement,
    userJoined,
    userLeft,
    messageReceived,
    updateChatScroll
};
