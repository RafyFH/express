// models/Book.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Rack = require('./Racks');

const Member = sequelize.define('members', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Book.belongsTo(Rack, { foreignKey: 'rack_id', as: 'rack' });
// Rack.hasMany(Book, { foreignKey: 'rack_id', as: 'books' });

module.exports = Member;
