'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false },
      gender: { type: Sequelize.DataTypes.ENUM, values: ['M', 'F', 'O'] },
      age: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
      date_of_joining: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      height: { type: Sequelize.DataTypes.STRING, allowNull: true },
      weight: { type: Sequelize.DataTypes.STRING, allowNull: true },
      package: { type: Sequelize.DataTypes.ENUM, values: ['1', '3', '6'], allowNull: false },
      blood_group: { type: Sequelize.DataTypes.ENUM, values: ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-'], allowNull: true },
      paid: { type: Sequelize.DataTypes.STRING, allowNull: false },
      balance: { type: Sequelize.DataTypes.STRING, allowNull: true },
      looking_for: { type: Sequelize.DataTypes.ENUM, values: ['Weight Loss', 'Weight Gain', 'Healthy Plan'], allowNull: true },
      visit: { type: Sequelize.DataTypes.ENUM, values: ['Online', 'Visit'], allowNull: true },
      food_habit: { type: Sequelize.DataTypes.ENUM, values: ['Veg', 'Non-Veg', 'Egg'], allowNull: true },
      ref: { type: Sequelize.DataTypes.STRING, allowNull: true },
      address: { type: Sequelize.DataTypes.STRING, allowNull: true },
      email: { type: Sequelize.DataTypes.STRING, allowNull: true },
      DOB: { type: Sequelize.DataTypes.DATEONLY, allowNull: true },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('clients');
  }
};