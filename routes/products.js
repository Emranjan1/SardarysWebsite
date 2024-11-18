// routes/products.js
const router = require('express').Router();
const multer = require('multer');
const db = require('../models');
const { Op } = require('sequelize');
const { verifyToken, verifyAdmin } = require('../middleware/authenticationMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.get('/', async (req, res) => {
  try {
    let queryOptions = {
      include: [{ model: db.Category, as: 'category' }],
      order: [['displayOrder', 'ASC']]  // Add this line to sort by displayOrder
    };

    if (req.query.allVisible !== 'true') {
      queryOptions.where = { isVisible: true };
    }

    const products = await db.Product.findAll(queryOptions);
    res.json(products.map(product => ({
      ...product.get({ plain: true }),
      ageVerificationRequired: product.ageVerificationRequired
    })));
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



router.post('/', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const { name, price, categoryId, description, ageVerificationRequired } = req.body; // Include description here
  const imageUrl = req.file ? req.file.path : null;

  if (!name || !price || !categoryId) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ message: 'Name, price, and category ID are required.' });
  }

  try {
    const category = await db.Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID.' });
    }

    const product = await db.Product.create({
      name,
      price,
      description, // Save the description
      image: imageUrl,
      categoryId,
      ageVerificationRequired: ageVerificationRequired === 'true'
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Add this endpoint for fetching products by category
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await db.Product.findAll({
      where: {
        categoryId,
        isVisible: true  // Ensure only visible products are fetched
      },
      order: [['displayOrder', 'ASC']]  // Sort by displayOrder
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const products = await db.Product.findAll({
      where: {
        name: {
          [Op.like]: `%${q}%`,
        },
      },
    });

    const similarProducts = await db.Product.findAll({
      where: {
        name: {
          [Op.notLike]: `%${q}%`,
        },
      },
    });

    res.json({ products, similarProducts });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to toggle product visibility
router.put('/toggle-visibility/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.Product.findByPk(id);
    if (product) {
      product.isVisible = !product.isVisible;
      await product.save();
      res.json({ message: 'Product visibility updated', product: product });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
  }
});
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
// PUT endpoint to update a product's display order
router.put('/:id/display-order', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { displayOrder } = req.body;

  try {
    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.displayOrder = displayOrder;
    await product.save();
    res.json({ message: 'Display order updated successfully', product });
  } catch (error) {
    console.error('Failed to update product display order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
