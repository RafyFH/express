// index.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
// const authRoutes = require('./routes/auth');
// const rackRoutes = require('./routes/racks');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const borrowRoutes = require('./routes/borrows');

const app = express();
//
// app.use(cors({
//     origin: '*', // Izinkan semua origin, bisa diganti dengan domain tertentu
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode HTTP yang diizinkan
//     allowedHeaders: ['Content-Type', 'Authorization'] // Header yang diizinkan
// }));

app.use(express.json());
// Routes
app.use('/borrows', borrowRoutes);
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// Sinkronisasi Database
sequelize.sync().then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
