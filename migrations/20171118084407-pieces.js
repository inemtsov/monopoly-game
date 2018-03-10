'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'pieces',
            {
                pieceid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                image: {
                    type: Sequelize.STRING,
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
        return queryInterface.dropTable('pieces');
    }
};