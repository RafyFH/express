const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

exports.Register = async (req, res) => {
    const { username, password, email } = req.body;

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Simpan user baru
      const user = await User.create({ username, password: hashedPassword, email });
      res.json({ message: "User created", user });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
}
exports.Login = async (req, res) => {
  const username = req.headers['username'];
  const password = req.headers['password'];

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Payload untuk token
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username
    };

    // Generate access token (expires in 15 minutes)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Generate refresh token (expires in 7 days)


    console.log(accessToken)
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Simpan refresh token di database
    user.refreshToken = refreshToken;

    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
// controllers/authController.js
exports.RefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }
  
    try {
      // Verifikasi refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
      // Cari user dengan refresh token yang cocok
      const user = await User.findOne({ where: { id: decoded.userId, refreshToken } });
  
      if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
  
      // Buat access token baru
      const payload = {
        userId: user.id,
        email: user.email,
        username: user.username
      };
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: "Invalid refresh token", error });
    }
  };
  