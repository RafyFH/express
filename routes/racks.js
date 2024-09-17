// routes/racks.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const Rack = require('../models/Racks');

const router = express.Router();

// Create Rack
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, location } = req.body;
    const rack = await Rack.create({ name, location });
    res.json(rack);
  } catch (error) {
    res.status(500).json({ message: "Error creating rack", error });
  }
});

// Get All Racks
router.get('/', async (req, res) => {
  try {
    const racks = await Rack.findAll();
    res.json(racks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching racks", error });
  }
});

// Update Rack
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, location } = req.body;
    const rack = await Rack.findByPk(req.params.id);
    if (!rack) {
      return res.status(404).json({ message: "Rack not found" });
    }

    rack.name = name;
    rack.location = location;
    await rack.save();
    res.json(rack);
  } catch (error) {
    res.status(500).json({ message: "Error updating rack", error });
  }
});

// Delete Rack
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const rack = await Rack.findByPk(req.params.id);
    if (!rack) {
      return res.status(404).json({ message: "Rack not found" });
    }

    await rack.destroy();
    res.json({ message: "Rack deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rack", error });
  }
});

module.exports = router;
