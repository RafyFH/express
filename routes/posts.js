const express = require('express');
const authenticateToken = require('../middleware/auth');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const router = express.Router();

// Definisikan model Post
const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Create Post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// Read All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Update Post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title;
    post.content = content;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// Delete Post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

module.exports = router;