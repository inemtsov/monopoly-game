'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'ownedProperties',
            {
                propertyid: {
                    type: Sequelize.INTEGER,
                    foreignKey: true,
                },
                userid: {
                    type: Sequelize.INTEGER,
                    foreignKey: true,
                    allowNull: false
                },
                setOwned: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                numberOfBuildings: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                },
                property_group_: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                gameid: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
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
        return queryInterface.dropTable('ownedProperties');
    }
};
