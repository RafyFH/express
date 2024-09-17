const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rack = sequelize.define('racks', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
});

module.exports = Rack;