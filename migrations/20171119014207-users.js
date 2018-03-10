'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'users',
            {
                userid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                firstName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                lastName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                avatar: {
                    type: Sequelize.STRING,
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
        queryInterface.dropTable('users');
    }
};
