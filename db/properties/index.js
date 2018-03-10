'use strict';

const db = require('../index');

const findProperty = (id) => {
    return db.one(`SELECT * FROM properties WHERE board_position = $1`, [id])
};

const getOwnedProperty = (propertyid, gameid) => {
    return db.oneOrNone(`SELECT * FROM \"ownedProperties\" WHERE propertyid = $1 AND gameid= $2`, [propertyid, gameid])
};

const newOwnedProperty = (propertyid, userid, setowned, numofbuildings, propertygroup, gameid) => {
    return db.one('INSERT INTO \"ownedProperties\" ("propertyid", "userid", \"setOwned\", \"numberOfBuildings\", "property_group_", \"gameid\")  ' +
        'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [propertyid, userid, setowned, numofbuildings, propertygroup, gameid]
    )
};

const findOwnedProperties = (userid, propertygroup) => {
    return db.any(`SELECT * FROM \"ownedProperties\" o, "properties" p WHERE o.propertyid = p.board_position AND o.userid = $1 AND o.property_group_= $2`, [userid, propertygroup])
};

const setOwnedToOne = (userid, propertygroup) => {
    return db.any('UPDATE \"ownedProperties\" SET \"setOwned\" = 1 ' +
        'WHERE \"property_group_\" = $1 AND \"userid\"=$2', [propertygroup, userid])
};

/*const getOwnedPropertyByUserId = (userId) => {
    return db.any(`SELECT p.name, p.property_group_, \"o.numberOfBuildings\" FROM "properties" p, "ownedProperties" o WHERE O.propertyid = p.board_position AND o.userid = $1`, [userId]);
};*/

const getOwnedPropertyByUserId = (userId) => {
    return db.any(`SELECT * FROM "properties" p, "ownedProperties" o WHERE O.propertyid = p.board_position AND o.userid = $1`, [userId]);
};

const getSetNumber = (propertyId) => {
    return db.one(`SELECT setnumber FROM "properties" WHERE board_position = $1`, [propertyId]);
};

const deletePlayerOwnedProperties = (userId) => {
    return db.none('DELETE FROM \"ownedProperties\" WHERE userid = $1', [userId]);
};

const buildHouses = (propertyId, housesToBuild, userid) => {
    return db.one(`UPDATE \"ownedProperties\" SET \"numberOfBuildings\" = $1 WHERE propertyid = $2 AND userid =$3 RETURNING propertyid`, [housesToBuild, propertyId, userid]);
};

const getHouseCost = (propertyId) => {
    return db.one(`SELECT house_cost FROM properties WHERE  board_position = $1`, [propertyId]);
};

module.exports = {
    findProperty,
    getOwnedProperty,
    newOwnedProperty,
    findOwnedProperties,
    setOwnedToOne,
    getOwnedPropertyByUserId,
    getSetNumber,
    deletePlayerOwnedProperties,
    buildHouses,
    getHouseCost
};
