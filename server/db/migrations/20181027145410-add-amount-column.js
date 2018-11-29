'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn('clients', 'amount', {
    allowNull: true,
    type: Sequelize.STRING,
    defaultValue: 0
   });
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('clients', 'amount');
  }
};
