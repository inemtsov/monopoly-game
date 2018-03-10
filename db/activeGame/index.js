'use strict';

const db = require('../index');

const createActiveGame = (gameName, numberOfMaxPlayers, startingBankroll, active, numberOfPlayers, status) => {
    return db.one('INSERT INTO \"activeGames\" ("gameName", "numberOfMaxPlayers", "startingBankroll", "active", "numberOfPlayers", "status") ' +
        'VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [gameName, numberOfMaxPlayers, startingBankroll, active, numberOfPlayers, status]);
};

const findActiveGames = () => {
    return db.any(`SELECT * FROM \"activeGames\" WHERE active = true`);
};

const addPlayer = (gameid) => {
    return db.one('UPDATE \"activeGames\" SET \"numberOfPlayers\" = \"numberOfPlayers\" + 1 ' +
        'WHERE \"gameid\" = $1 RETURNING *', [gameid]);
};

const getGame = (gameid) => {
    return db.one(`SELECT * FROM \"activeGames\" WHERE gameid = $1`, [gameid]);
};

const addMoneyToPot = (gameid, amount) => {
    return db.one('UPDATE \"activeGames\" SET pot = pot + $1 ' +
        'WHERE \"gameid\" = $2 RETURNING pot', [amount, gameid]);
};

const getGamePotAmount = (gameid) => {
    return db.one('SELECT pot FROM \"activeGames\" WHERE gameid = $1', [gameid]);
};

const getProperties = () => {
    return db.many('SELECT * FROM properties');
};

const getPropertiesBuildable = (userId) => {
    return db.many('SELECT * FROM "properties" p, "ownedProperties" o WHERE o.propertyid = p.board_position AND o.userid = $1 AND o."setOwned" = 1', [userId]);
};

const getUserIdTurn = (gameId) => {
    return db.one('SELECT userid FROM players WHERE gameid = $1 AND \"isTurn\" = 1', [gameId]);
};

const deductMoneyFromPot = (gameId, amount) => {
    return db.one('UPDATE \"activeGames\" SET pot = pot -  $1 ' +
        'WHERE \"gameid\" = $2 RETURNING pot', [amount, gameId]);
};

const setGameStatus = (gameid, status) => {
    return db.one('UPDATE \"activeGames\" SET status = $2 ' +
        'WHERE \"gameid\" = $1 RETURNING *', [gameid, status]);
};

const setGameActive = (gameid, active) => {
    return db.one('UPDATE \"activeGames\" SET active = $2 ' +
        'WHERE \"gameid\" = $1 RETURNING *', [gameid, active]);
}

module.exports = {
    createActiveGame,
    findActiveGames,
    addPlayer,
    getGame,
    addMoneyToPot,
    getGamePotAmount,
    getProperties,
    setGameStatus,
    getPropertiesBuildable,
    getUserIdTurn,
    deductMoneyFromPot,
    setGameActive
};
