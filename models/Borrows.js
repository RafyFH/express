const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./Books');
const Member = require('./Members');

const Borrow = sequelize.define('Borrow', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    member_code: {
        type: DataTypes.STRING,
        references: {
            model: Member,
            key: 'code',
        },
        allowNull: false,
    },
    borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

Borrow.belongsTo(Member, { foreignKey: 'member_code', as: 'member' });
Member.hasMany(Borrow, { foreignKey: 'member_code', as: 'borrows' });

Borrow.belongsToMany(Book, {
    through: 'BorrowBooks',
    foreignKey: 'borrow_code',
    otherKey: 'book_code',
    as: 'books'
});

Book.belongsToMany(Borrow, {
    through: 'BorrowBooks',
    foreignKey: 'book_code',
    otherKey: 'borrow_code',
    as: 'borrows'
});

module.exports = Borrow;