const { Sequelize, Transaction } = require('sequelize');
const sequelize = require('../config/database');
const Borrow = require('../models/Borrows');
const Book = require('../models/Books');
const Member = require('../models/Members');
const BorrowBooks = require('../models/BorrowBooks');
const Penalized = require('../models/Penalized');

exports.borrowBook = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { member_code, book_codes } = req.body;

        const member = await Member.findByPk(member_code, { transaction });
        if (!member) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Member not found' });
        }

        const today = new Date();
        if (member.is_penalized && member.penalized_until > today) {
            await transaction.rollback();
            return res.status(403).json({ message: `Member is penalized until ${member.penalized_until}` });
        }

        const borrowedBooksCount = await BorrowBooks.count({
            include: {
                model: Borrow,
                where: { member_code, return_date: null }
            },
            transaction
        });

        if (borrowedBooksCount >= 2) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Member already borrowed 2 books' });
        }

        const activeBorrowsCount = await BorrowBooks.count({
            include: {
                model: Borrow,
                where: { member_code, return_date: null }
            },
            transaction
        });

        if (activeBorrowsCount >= 2) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Member already borrowed 2 books' });
        }


        const borrowCount = await Borrow.count({ transaction });
        const nextNumber = borrowCount + 1;

        const code = `B${nextNumber}`;

        const borrow = await Borrow.create({
            code,
            member_code,
            borrow_date: today,
            due_date: new Date(today.setDate(today.getDate() + 7))
        }, { transaction });

        for (const book_code of book_codes) {
            const book = await Book.findByPk(book_code, { transaction });
            if (!book || book.stock <= 0) {
                await transaction.rollback();
                return res.status(400).json({ message: `Book ${book_code} is not available or out of stock` });
            }

            book.stock -= 1;
            await book.save({ transaction });

            await BorrowBooks.create({
                borrow_code: borrow.code,
                book_code
            }, { transaction });
        }

        await transaction.commit();
        res.status(200).json({ message: 'Books borrowed successfully', data: borrow });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error borrowing books', error });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { member_code, book_code } = req.body;

        const borrow = await Borrow.findOne({
            where: {
                member_code,
                return_date: null
            },
            include: {
                model: Book,
                as: 'books',
                where: { code: book_code }
            }
        });

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        borrow.return_date = new Date();
        await borrow.save();

        const book = await Book.findByPk(book_code);
        book.stock += 1;
        await book.save();

        if (borrow.return_date > borrow.due_date) {
            const member = await Member.findByPk(member_code);
            const penalizedUntil = new Date();
            penalizedUntil.setDate(penalizedUntil.getDate() + 3);
            member.is_penalized = true;
            member.penalized_until = penalizedUntil;
            await member.save();

            await Penalized.create({
                member_code,
                penalized_until
            });
        }

        res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error returning book', error });
    }
};

exports.getPenalizedMembers = async (req, res) => {
    try {
        const penalizedMembers = await Penalized.findAll();
        res.status(200).json({
            status: 200,
            message: "success fetch penalized members",
            data: penalizedMembers
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching penalized members", error });
    }
};