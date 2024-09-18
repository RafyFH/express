const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require('./Members');

const Penalized = sequelize.define('Penalized', {
    member_code: {
        type: DataTypes.STRING,
        references: {
            model: Member,
            key: 'code'
        },
        allowNull: false,
    },
    penalized_until: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

module.exports = Penalized;