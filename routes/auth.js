const express = require('express');
const { Register, Login, RefreshToken } = require('../controller/auth');

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh-token', RefreshToken);

module.exports = router;
