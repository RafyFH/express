const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Member = require('./models/Members');
const Book = require('./models/Books');
const Borrow = require('./models/Borrows');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const borrowRoutes = require('./routes/borrows');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

Member.hasMany(Borrow, { foreignKey: 'member_code', as: 'borrows' });
Borrow.belongsTo(Member, { foreignKey: 'member_code', as: 'member' });

Book.hasMany(Borrow, { foreignKey: 'book_code', as: 'borrows' });
Borrow.belongsTo(Book, { foreignKey: 'book_code', as: 'book' });

// Routing
app.use('/borrows', borrowRoutes);
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// Sinkronisasi Database dan Start Server
sequelize.sync({ force: true })
    .then(() => {
      console.log('Database connected');
      const PORT = process.env.PORT || 6000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});