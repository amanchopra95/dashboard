'use strict';
module.exports = (sequelize, DataTypes) => {
  const Phone = sequelize.define('phone', {
    phoneType: {
      type: DataTypes.ENUM('Mobile', 'Landline', 'WhatsApp')
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      },
      allowNull: false
    },
  }, {});
  Phone.associate = function (models) {
    // associations can be defined here
    models.phone.belongsTo(models.client);
  };
  return Phone;
};