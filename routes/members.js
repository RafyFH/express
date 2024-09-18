// routes/books.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getMembers, postMembers, getMembersPageable, getMembersById, putMembers} = require('../controller/members');

const router = express.Router();

router.post('/', postMembers);
router.get('/', getMembers);
router.get('/pageable', getMembersPageable);
router.put('/:id', putMembers);
router.delete('/:id', getMembersPageable);
router.get('/:id', getMembersById);

module.exports = router;
