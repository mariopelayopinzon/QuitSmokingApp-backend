const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cigarettesPerDay: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    smokingStartAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    }
}, {
    tableName: 'Users',
    timestamps: true,
    paranoid: true

});

module.exports = User;

