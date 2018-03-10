'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'chanceCards',
            {
                chanceCardid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                boardPosition: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                amount: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                actionType: {
                    type: Sequelize.TEXT,
                    allowNull: false
                }
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('chanceCards');
    }
};