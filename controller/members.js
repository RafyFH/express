const authenticateToken = require("../middleware/auth");
const Member = require("../models/Members");

exports.postMembers = async (req, res) => {
    try {
        const { name } = req.body;

        const nameInitials = name
            .split(' ')
            .map(word => word[0].toUpperCase())
            .join('');

        const memberCount = await Member.count();
        const nextNumber = memberCount + 1;

        const code = `${nameInitials}-${nextNumber}`;

        const member = await Member.create({ code, name });
        res.status(200).json({
            status: 200,
            message: "success insert data",
            data: member,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating member", error });
    }
}
exports.getMembers = async(req, res) => {
    try {
        const members = await Member.findAll();
        res.status(200).json({
            status: 200,
            message: "success",
            data: members,
        });
    } catch {
        res.status(500).json({ message: "Error fetching members", error })
    }
}
exports.getMembersPageable = async (req, res) => {
    // Ambil parameter limit, page, dan filter dari query string
    const limit = parseInt(req.query.limit) || 10; // default limit adalah 10
    const page = parseInt(req.query.page) || 1; // default page adalah 1
    const search = req.query.search || ''; // filter global
    const name = req.query.name; // filter per field

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
        if (name) {
            whereClause.name = { [Op.iLike]: `%${name}%` };
        }
        // Ambil data buku dengan limit, offset, dan filter
        const { count, rows } = await Member.findAndCountAll({
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
        res.status(500).json({ message: "Error retrieving members", error });
    }
};

exports.getMembersById = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) {
            return res.status(200).json({  status: 200, message: "Member not found" });
        }else{
            res.status(200).json({
                status: 200,
                message: "success",
                data: member,
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating member", error });
    }
};

exports.putMembers = async (req, res) => {
    try {
        const { name } = req.body;
        const member = await Member.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        member.name = name;
        await member.save();
        res.status(200).json({
            status: 200,
            message: "success insert data",
            data: member,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating member", error });
    }
};

exports.deleteMembers = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        await member.destroy();
        res.json({ message: "Member deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting member", error });
    }
}