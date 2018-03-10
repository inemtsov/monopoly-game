'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'players',
            {
                playerid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                gameid: {
                    type: Sequelize.INTEGER,
                    foreignKey: true,
                    allowNull: false
                },
                money: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                userid: {
                    type: Sequelize.INTEGER,
                    foreignKey: true,
                },
                jailFreeCardsOwned: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false,
                },
                position: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },
                pieceid: {
                    type: Sequelize.INTEGER,
                    foreignKey: true,
                },
                inJail: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('NOW()'),
                    allowNull: false
                },
                isTurn: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                hasRolled: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                }
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('players');
    }
};