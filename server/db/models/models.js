const Sequelize = require('sequelize');

const db = new Sequelize(
    'just_diet',
    'just_diet',
    'Justdiet@2018!',
    {
        dialect: 'mysql',
        host: 'localhost',
        timezone: '+5:30',
    }
);

const User = db.define('user', {
    username: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: Sequelize.DataTypes.ENUM('admin', 'employee', 'intern'),
        allowNull: true
    }
});

const Phone = db.define('phone', {
    phoneType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
});

const Client = db.define('client', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    name: {type: Sequelize.DataTypes.STRING, allowNull: false },
    gender: {type: Sequelize.DataTypes.ENUM, values: ['M', 'F', 'O'] },
    age: {type: Sequelize.DataTypes.INTEGER, allowNull: false },
    date_of_joining: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
    end_date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
    height: { type: Sequelize.DataTypes.STRING, allowNull: true },
    weight: { type: Sequelize.DataTypes.STRING, allowNull: true },
    package: {type: Sequelize.DataTypes.STRING, allowNull: false },
    blood_group: {type: Sequelize.DataTypes.ENUM, values: ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-' ], allowNull: true },
    paid: { type: Sequelize.DataTypes.STRING, allowNull: false },
    balance: {type: Sequelize.DataTypes.STRING, allowNull: true },
    looking_for: {type: Sequelize.DataTypes.ENUM, values: ['Weight Loss', 'Weight Gain', 'Healthy Plan'], allowNull: true },
    visit: {type: Sequelize.DataTypes.ENUM, values: ['Online', 'Visit'], allowNull: true }, 
    food_habit: {type: Sequelize.DataTypes.STRING, allowNull: true },
    ref: { type: Sequelize.DataTypes.STRING, allowNull: true },
    address: { type: Sequelize.DataTypes.STRING, allowNull: true },
    email: { type: Sequelize.DataTypes.STRING, allowNull: true },
    DOB: { type: Sequelize.DataTypes.DATEONLY, allowNull: true }
});

Client.hasMany(Phone, {foreignKey: 'clientId'});

db.sync()
    .then(() => console.log('Database connected'));

module.exports = {
    db,
    User, 
    Client,
    Phone,
    Sequelize
};

