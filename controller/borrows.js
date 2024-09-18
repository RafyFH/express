const { Sequelize, Transaction } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('../models/Books');
const Member = require('../models/Members');
const Borrow = require('../models/Borrows');
const moment = require("moment");

exports.borrowBook = async (req, res) => {
    const { memberCode, bookCodes } = req.body;

    try {
        if (!Array.isArray(bookCodes) || bookCodes.length === 0 || bookCodes.length > 2) {
            return res.status(400).json({ error: 'Member hanya bisa meminjam 1 atau 2 buku.' });
        }

        const member = await Member.findOne({ where: { code: memberCode } });
        if (member.penalty_end_date && moment().isBefore(member.penalty_end_date)) {
            return res.status(403).json({ error: 'Member sedang dalam masa penalti. Tidak bisa meminjam buku.' });
        }

        const activeBorrows = await Borrow.count({
            where: {
                member_code: memberCode,
                status: 'borrowed',
            },
        });

        if (activeBorrows + bookCodes.length > 2) {
            return res.status(400).json({ error: 'Member sudah meminjam buku atau melebihi batas peminjaman (maksimal 2).' });
        }

        for (const bookCode of bookCodes) {
            const book = await Book.findOne({ where: { code: bookCode } });

            if (!book || book.stock <= 0) {
                return res.status(404).json({ error: `Buku dengan kode ${bookCode} tidak ditemukan atau stok habis.` });
            }

            book.stock -= 1;
            await book.save();

            await Borrow.create({
                member_code: memberCode,
                book_code: bookCode,
                borrow_date: new Date(),
                status: 'borrowed',
            });
        }

        res.json({ message: 'Buku berhasil dipinjam!', books: bookCodes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.returnBook = async (req, res) => {
    const { memberCode, bookCode } = req.body;

    try {
        const borrow = await Borrow.findOne({
            where: {
                member_code: memberCode,
                book_code: bookCode,
                status: 'borrowed',
            },
        });

        if (!borrow) {
            return res.status(400).json({ error: 'Peminjaman tidak ditemukan.' });
        }

        const borrowDate = moment(borrow.borrow_date);
        const currentDate = moment();
        const isLate = currentDate.isAfter(borrowDate.add(7, 'days'));

        borrow.return_date = new Date();
        borrow.status = 'returned';
        await borrow.save();

        const book = await Book.findOne({ where: { code: bookCode } });
        book.stock += 1;
        await book.save();

        if (isLate) {
            const member = await Member.findOne({ where: { code: memberCode } });
            member.penalty_end_date = moment().add(3, 'days').toDate(); // Tambah 3 hari penalti
            await member.save();
        }

        return res.json({ message: 'Buku berhasil dikembalikan!', borrow });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};