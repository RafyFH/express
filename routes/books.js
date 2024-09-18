// routes/books.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const Book = require('../models/Books');
const { getBooks, postBooks, getBooksPageable, getBooksById, putBooks} = require('../controller/books');

const router = express.Router();

router.post('/', postBooks);
router.get('/', getBooks);
router.get('/pageable', getBooksPageable);
router.put('/:id', putBooks);
router.delete('/:id', getBooksPageable);
router.get('/:id', getBooksById);

module.exports = router;
