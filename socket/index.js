const socketIo = require("socket.io");
const passport = require("../config/passport");
const passportSocketIo = require("passport.socketio");
const cookieParser = require("cookie-parser");
const gameController = require("../controllers/gameController");
const activeGamesDB = require("../db/activeGame/index");
const {
    USER_JOINED,
    USER_LEFT,
    MESSAGE_SEND,
    USER_TYPING,
    ROLL_DICE,
    LOG,
    MOVE,
    START,
    INIT
} = require("../src/constants/events");

let users = [];

const init = (app, server) => {
    const io = socketIo(server);

    io.use(
        passportSocketIo.authorize({
            key: "connect.sid",
            secret: "monopoly",
            store: app.sessionStore,
            passport,
            cookieParser
        })
    );

    app.set("io", io);

    io.on("connection", socket => {
        const user = socket.request.user.username;
        if (!users.includes(user)) {
            users.push(user);
        }

        socket.on("disconnect", data => {
            users = users.filter(user => user === user);
            users.splice(users.indexOf(user));
            io.in(`game-0`).emit(USER_LEFT, {user, users});
        });

        socket.on("join", gameId => {
            socket.join(`game-${gameId}`);
            io.in(`game-${gameId}`).emit(USER_JOINED, {user, users});
            // emit start message
            if (gameId != 0) {
                activeGamesDB.addMoneyToPot(gameId, 0)
                    .then((gamePot) => {
                        let pot = gamePot.pot;
                        return activeGamesDB.getUserIdTurn(gameId)
                            .then((nextUser) => {
                                let nextUserId = nextUser.userid;
                                return activeGamesDB.getGame(gameId)
                                    .then((game) => {
                                        return gameController.buildProcessInit(nextUserId)
                                            .then((propertiesBuildable) => {
                                                return gameController.startMessage(gameId)
                                                    .then((players) => {
                                                        let status = game.status;
                                                        io.in(`game-${gameId}`).emit(INIT, {
                                                            players,
                                                            pot,
                                                            propertiesBuildable,
                                                            status
                                                        });
                                                        let message;
                                                        if (!status) {
                                                            message = " is waiting for more people";
                                                        } else {
                                                            message = " game active !";
                                                        }
                                                        let username = "Game"
                                                        io.in(`game-${gameId}`)
                                                            .emit(LOG, {
                                                                username,
                                                                message
                                                            });

                                                    });
                                            })
                                    })

                            })
                    })
            }

        });

        socket.on(MESSAGE_SEND, data => {
            io.in(`game-${data.id}`).emit(MESSAGE_SEND, Object.assign({}, data, {user}));
        });


    });
};

module.exports = {init};
