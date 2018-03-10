'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'session',
            {
                sid: {
                    type: Sequelize.CHAR,
                    primaryKey: true,
                },
                sess: {
                    type: Sequelize.JSON,
                    allowNull: false
                },
                expire: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('session');
    }
};