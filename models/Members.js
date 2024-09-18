const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    penalty_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Member;