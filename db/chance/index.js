'use strict';

const db = require('../index');

const getChanceCard = (chanceCardId) => {
    return db.one(`SELECT * FROM \"chanceCards\" WHERE \"chanceCardid\" = $1`, [chanceCardId]);
};

module.exports = {
    getChanceCard
}
