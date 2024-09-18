const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Borrow = require('./Borrows');
const Book = require('./Books');

// Define BorrowBooks model
const BorrowBooks = sequelize.define('BorrowBooks', {
    borrow_code: {
        type: DataTypes.STRING,
        references: {
            model: Borrow,
            key: 'code',
        },
        allowNull: false,
        primaryKey: true,
    },
    book_code: {
        type: DataTypes.STRING,
        references: {
            model: Book,
            key: 'code',
        },
        allowNull: false,
        primaryKey: true,
    },
});

module.exports = BorrowBooks;