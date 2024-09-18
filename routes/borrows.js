// routes/books.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const {borrowBook, returnBook} = require("../controller/borrows");

const router = express.Router();

router.post('/', borrowBook);
router.post('/return', returnBook);
// router.get('/penalized/list', getPenalizedMembers);

module.exports = router;
