// routes/books.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const Book = require('../models/Books');
const { getBooks, postBooks, getBooksPageable } = require('../controller/books');

const router = express.Router();

router.post('/', authenticateToken ,postBooks);
router.get('/',authenticateToken, getBooks);
router.get('/pageable',authenticateToken, getBooksPageable);

// Update Book
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, author, rack_id } = req.body;
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title;
    book.author = author;
    book.rack_id = rack_id;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
});

// Delete Book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.destroy();
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
});

module.exports = router;
