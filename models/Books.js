// models/Book.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Rack = require('./Racks');

const Book = sequelize.define('books', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // rack_id: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: Rack,
  //     key: 'id',
  //   },
  //   allowNull: true,
  // },
});

// Book.belongsTo(Rack, { foreignKey: 'rack_id', as: 'rack' });
// Rack.hasMany(Book, { foreignKey: 'rack_id', as: 'books' });

module.exports = Book;
