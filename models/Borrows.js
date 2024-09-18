const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./Books');
const Member = require('./Members');

const Borrow = sequelize.define('borrows', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    member_code: {
        type: DataTypes.STRING,
        references: {
            model: Member,
            key: 'code',
        },
    },
    book_code: {
        type: DataTypes.STRING,
        references: {
            model: Book,
            key: 'code',
        },
    },
    borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'borrowed',
    },
});

module.exports = Borrow;