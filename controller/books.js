const authenticateToken = require("../middleware/auth");
const Book = require("../models/Books");

exports.postBooks = async (req, res) => {
    try {
        const { title, author, rack_id } = req.body;
        const book = await Book.create({ title, author, rack_id });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Error creating book", error });
    }   
}
exports.getBooks = async(req, res) => {
    try {
        const books = await Book.findAll({include: 'rack'});
        res.json(books);
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
    const publishedDate = req.query.publishedDate; // filter per field
  
    if (limit < 1 || page < 1) {
      return res.status(400).json({ message: "Limit and page must be positive integers" });
    }
  
    try {
      // Hitung offset berdasarkan halaman
      const offset = (page - 1) * limit;
  
      // Filter query
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
  
      if (publishedDate) {
        whereClause.publishedDate = new Date(publishedDate);
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
        books: rows
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error });
    }
  };