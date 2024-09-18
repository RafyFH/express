const authenticateToken = require("../middleware/auth");
const Book = require("../models/Books");

exports.postBooks = async (req, res) => {
    try {
        const { title, author, stock } = req.body;
        const titleInitials = title
            .split(' ')
            .map(word => word[0].toUpperCase())
            .join('');

        const authorInitials = author
            .split(' ')
            .map(name => name[0].toUpperCase())
            .join('');

        const bookCount = await Book.count();
        const nextNumber = bookCount + 1;

        const code = `${titleInitials}-${authorInitials}-${nextNumber}`;

        const book = await Book.create({ code, title, author, stock});
        res.status(200).json({
            status: 200,
            message: "success insert data",
            data: book,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating book", error });
    }   
}
exports.getBooks = async(req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json({
            status: 200,
            message: "success",
            data: books,
        });
    } catch {
        res.status(500).json({ message: "Error fetching books", error })
    }
}
exports.getBooksPageable = async (req, res) => {
    // Ambil parameter limit, page, dan filter dari query string
    const limit = parseInt(req.query.limit) || 10; // default limit adalah 10
    const page = parseInt(req.query.page) || 1; // default page adalah 1
    const search = req.query.search || ''; // filter global
    const author = req.query.author; // filter per field
    const title = req.query.title; // filter per field
  
    if (limit < 1 || page < 1) {
      return res.status(400).json({ message: "Limit and page must be positive integers" });
    }
  
    try {
      const offset = (page - 1) * limit;

      const whereClause = {};
  
      // Filter global
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { author: { [Op.iLike]: `%${search}%` } }
        ];
      }
  
      // Filter per field
      if (author) {
        whereClause.author = { [Op.iLike]: `%${author}%` };
      }
  
      if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
      }
  
      // Ambil data buku dengan limit, offset, dan filter
      const { count, rows } = await Book.findAndCountAll({
        where: whereClause,
        limit,
        offset
      });
  
      // Kirim respons dengan data dan informasi paging
      res.json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
        data: rows
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error });
    }
  };

exports.getBooksById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(200).json({  status: 200, message: "Book not found" });
        }else{
            res.status(200).json({
                status: 200,
                message: "success",
                data: book,
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating book", error });
    }
};

exports.putBooks = async (req, res) => {
    try {
        const { title, author, stock } = req.body;
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        book.title = title;
        book.author = author;
        book.stock = stock;
        await book.save();
        res.status(200).json({
            status: 200,
            message: "success insert data",
            data: book,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating book", error });
    }
};

exports.deleteBooks = async (req, res) => {
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
}