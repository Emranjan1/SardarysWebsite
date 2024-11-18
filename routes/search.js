const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../models');

router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'No search query provided' });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`
        }
      }
    });

    // For similar products, you might implement some kind of recommendation logic here
    // For simplicity, let's return products with similar names
    const similarProducts = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${query.substring(0, 3)}%`
        },
        id: {
          [Op.ne]: products.map(product => product.id) // Exclude already found products
        }
      }
    });

    res.json({ products, similarProducts });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
