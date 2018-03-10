'use strict';

const db = require('../index');

const createUser = (firstName, lastName, username, email, password, avatar) => {
    return db.one('INSERT INTO users ("firstName", "lastName", "username", "email", "password", "avatar")  ' +
        'VALUES ($1,  $2, $3, $4, $5, $6) RETURNING *', [firstName, lastName, username, email, password, avatar])
};

const findByPlayerEmail = (email) => {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
};

const findPlayerById = (userid) => {
    return db.oneOrNone(`SELECT * FROM users WHERE userid = $1`, [userid])
};

const findActivePlayerById = (userid) => {
    return db.oneOrNone(`SELECT * FROM players WHERE userid = $1`, [userid])
};


const deletePlayer = (userid) => {
    return db.none(`DELETE FROM users WHERE userid = $1`, [userid])
};

const deletePlayerFromPlayers = (userid) => {
    return db.none(`DELETE FROM players WHERE userid = $1`, [userid])
};

const update = (firstName, lastName, username, email, password, userid) => {
    return db.one('UPDATE users SET \"firstName\" =$1, \"lastName\"=$2, \"username\"=$3, \"email\"=$4, \"password\"=$5 ' +
        'WHERE \"userid\" = $6 RETURNING *', [firstName, lastName, username, email, password, userid])
};

const setAvatar = (avatar, userid) => {
    return db.one('UPDATE users SET \"avatar\" =$1 ' +
        'WHERE \"userid\" = $2 RETURNING *', [avatar, userid])
};

const getPlayerPosition = (userid) => {
    return db.one(`SELECT * FROM players WHERE userid = $1`, [userid])
};

const updatePlayerPosition = (userid, newPosition) => {
    //console.log(userid, newPosition);
    return db.one('UPDATE players SET \"position\" =$1 ' +
        'WHERE \"userid\" = $2 RETURNING position', [newPosition, userid])
};

const newGamePlayer = (gameid, money, userid, jailFreeCardsOwned, position, inJail, isTurn, username) => {
    return db.one('INSERT INTO players ("gameid", "money", "userid", \"jailFreeCardsOwned\", "position", \"inJail\", \"isTurn\", username) ' +
        'VALUES ($1,  $2, $3, $4, $5, $6, $7, $8) RETURNING *', [gameid, money, userid, jailFreeCardsOwned, position, inJail, isTurn, username])
};

const getPlayerGame = (userid) => {
    return db.oneOrNone(`SELECT * FROM players WHERE userid = $1`, [userid])
};

const nextPlayer = (userid, gameid) => {
    return db.any('SELECT * FROM players WHERE gameid = $1 ORDER BY userid ASC', [gameid])
        .then((row) => {
            let index = 0;
            while (row[index].userid != userid) {
                index++;
            }
            index++;
            if (index == row.length) {
                console.log("circle");
                return row[0].userid;
            }
            else return row[index].userid;
        })
        .catch((err) => {
            return false;
        });
};

const changeTurnRight = (userId, nextUserId) => {
    //console.log("changeturn: " + userId +"/" + nextUserId);
    return db.one('UPDATE players SET \"isTurn\" =$1 WHERE \"userid\" = $2 RETURNING position', [0, userId])
        .then((position) => {
            return db.one('UPDATE players SET \"isTurn\" =$1 ' + 'WHERE \"userid\" = $2 RETURNING position', [1, nextUserId]);
        })
        .catch((err) => {
            return false;
        });
};

const findTurnUserId = (gameid) => {
    return db.one('SELECT * FROM players WHERE gameid = $1 AND \"isTurn\" = 1', [gameid]);
};

const initPosition = (gameId) => {
    return db.one('UPDATE players SET "position" = 0 WHERE gameid = $1 RETURNING position', [gameId]);
};

const incremementGetOutOfJailFreeCard = (userId) => {
    return db.one('UPDATE players SET \"jailFreeCardsOwned\" = \"jailFreeCardsOwned\" + 1 WHERE userid = $1 RETURNING \"jailFreeCardsOwned\"', [userId]);
};

const decrementGetOutOfJailFreeCard = (userId) => {
    return db.one('UPDATE players SET \"jailFreeCardsOwned\" = \"jailFreeCardsOwned\" - 1 WHERE userid = $1 RETURNING \"jailFreeCardsOwned\"', [userId]);
};

const putPlayerInJail = (userId) => {
    return db.one('UPDATE players SET \"inJail\" = 1 WHERE userid = $1 RETURNING \"inJail\"', [userId]);
};

const getPlayerMoney = (userId) => {
    return db.one('SELECT money FROM players WHERE userid = $1', [userId]);
};
const debitMoney = (userid, amount) => {
    return db.one('UPDATE players SET \"money\" =$2 ' +
        'WHERE \"userid\" = $1 RETURNING money', [userid, amount])
};

const debitMoneyAuto = (userid, toBeDebited) => {
    return db.one('UPDATE players SET \"money\" = \"money\" - $2 ' +
        'WHERE \"userid\" = $1 RETURNING money', [userid, toBeDebited])
};

const creditMoneyAuto = (userid, toBeCredited) => {
    return db.one('UPDATE players SET \"money\" = \"money\" + $2 ' +
        'WHERE \"userid\" = $1 RETURNING money', [userid, toBeCredited])
};

const updateMoney = (userid, amount) => {
    return db.one('UPDATE players SET \"money\" = $2 ' +
        'WHERE \"userid\" = $1 RETURNING money', [userid, amount])
};

const getPlayerFromGame = (gameid) => {
    return db.any('SELECT * FROM players WHERE gameid = $1 ORDER BY userid ASC', [gameid])
};

const getPlayerUsernameFromUserId = (userId) => {
    return db.one('SELECT username FROM players WHERE userid = $1', [userId])
};

const hasRolled = (userId, input) => {
    return db.any('UPDATE players SET \"hasRolled\" = $2 WHERE userid = $1', [userId, input])
};

const inJail = (userId, input) => {
    return db.any('UPDATE players SET \"inJail\" = $2 WHERE userid = $1', [userId, input])
};

const jailCardUsed = (userId) => {
    return db.any('UPDATE players SET "jailFreeCardsOwned" = "jailFreeCardsOwned" - 1 WHERE userid = $1', [userId])
};

const findNumberOfplayer = (gameid) => {
    return db.any('SELECT * FROM players WHERE gameid = $1', [gameid])

}


module.exports = {
    createUser,
    findByPlayerEmail,
    findPlayerById,
    deletePlayer,
    update,
    setAvatar,
    getPlayerPosition,
    updatePlayerPosition,
    newGamePlayer,
    getPlayerGame,
    findActivePlayerById,
    nextPlayer,
    changeTurnRight,
    getPlayerUsernameFromUserId,
    findTurnUserId,
    initPosition,
    debitMoneyAuto,
    creditMoneyAuto,
    debitMoney,
    updateMoney,
    incremementGetOutOfJailFreeCard,
    decrementGetOutOfJailFreeCard,
    putPlayerInJail,
    getPlayerMoney,
    getPlayerFromGame,
    hasRolled,
    inJail,
    jailCardUsed,
    deletePlayerFromPlayers,
    findNumberOfplayer
};
