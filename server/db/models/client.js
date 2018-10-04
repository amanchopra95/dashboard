'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: false },
    name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.ENUM, values: ['M', 'F', 'O'] },
    age: { type: DataTypes.INTEGER, allowNull: true },
    date_of_joining: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    height: { type: DataTypes.STRING, allowNull: true },
    weight: { type: DataTypes.STRING, allowNull: true },
    package: { type: DataTypes.ENUM, values: ['1', '3', '6'], allowNull: false },
    blood_group: { type: DataTypes.ENUM, values: ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-'], allowNull: true },
    paid: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.STRING, allowNull: true },
    looking_for: { type: DataTypes.ENUM, values: ['Weight Loss', 'Weight Gain', 'Healthy Plan'], allowNull: true },
    visit: { type: DataTypes.ENUM, values: ['Online', 'Visit'], allowNull: true },
    food_habit: { type: DataTypes.ENUM, values: ['Veg', 'Non-Veg', 'Egg'], allowNull: true },
    ref: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    DOB: { type: DataTypes.DATEONLY, allowNull: true },
  }, {});
  Client.associate = function (models) {
    // associations can be defined here
    models.client.hasMany(models.phone);
  };
  return Client;
};