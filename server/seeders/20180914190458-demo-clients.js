'use strict';

const sample_client_data = require('../sample-client-data');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('clients', sample_client_data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('clients', null, {});
  }
};
