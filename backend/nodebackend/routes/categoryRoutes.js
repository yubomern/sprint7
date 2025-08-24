const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const cat = await Category.create({ name, description });
    res.json({ success: true, category: cat });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// Update
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  res.json(updated);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
