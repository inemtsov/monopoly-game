'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'activeGames',
            {
                gameid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                gameName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                numberOfPlayers: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                },
                numberOfMaxPlayers: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                startingBankroll: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                pot: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                },
                active: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                },
                status: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('NOW()'),
                    allowNull: false
                }
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('activeGames');
    }
};