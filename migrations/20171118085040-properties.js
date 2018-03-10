'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'properties',
            {

                board_position: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                property_group_: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                cost_to_buy: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_0: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_m: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_1: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_2: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_3: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_4: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                rent_h: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                house_cost: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                property: {
                    type: Sequelize.SMALLINT,
                    allowNull: false,
                },
                mortgage_value: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                community_chest: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                chance: {
                    type: Sequelize.SMALLINT,
                    allowNull: false,
                },
                railroad: {
                    type: Sequelize.SMALLINT,
                    allowNull: false,
                },
                utility: {
                    type: Sequelize.SMALLINT,
                    allowNull: false,
                },
                fine_: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('NOW()'),
                    allowNull: false
                },
                setnumber: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                }
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('properties');
    }
};