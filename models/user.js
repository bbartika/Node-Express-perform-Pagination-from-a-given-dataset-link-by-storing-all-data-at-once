const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_street: {
        type: DataTypes.STRING,
    },
    address_suite: {
        type: DataTypes.STRING,
    },
    address_city: {
        type: DataTypes.STRING,
    },
    address_zipcode: {
        type: DataTypes.STRING,
    },
    address_geo_lat: {
        type: DataTypes.STRING,
    },
    address_geo_lng: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    website: {
        type: DataTypes.STRING,
    },
    company_name: {
        type: DataTypes.STRING,
    },
    company_catchPhrase: {
        type: DataTypes.STRING,
    },
    company_bs: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

module.exports = User;
