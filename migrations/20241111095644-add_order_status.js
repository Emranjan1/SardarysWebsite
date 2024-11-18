'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'orderStatus', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'In Progress'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'orderStatus');
  }
};
