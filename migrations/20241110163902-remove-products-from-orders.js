'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'products');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'products', {
      type: Sequelize.JSON,
      allowNull: false
    });
  }
};
