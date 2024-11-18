const router = require('express').Router();
const db = require('../models');
const { verifyToken, verifyAdmin } = require('../middleware/authenticationMiddleware');

router.get('/', async (req, res) => {
  try {
    const categories = await db.Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message); // Enhanced logging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const existingCategory = await db.Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const category = await db.Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error.message); // Enhanced logging
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.Category.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'Category deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Category not found.' });
    }
  } catch (error) {
    console.error('Error deleting category:', error.message); // Enhanced logging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
