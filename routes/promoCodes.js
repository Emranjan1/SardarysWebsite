const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken, verifyAdmin } = require('../middleware/authenticationMiddleware');

// Create a promo code
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { code, discountPercentage, validFrom, validUntil, usageLimit } = req.body;
  try {
    const newPromoCode = await db.PromoCode.create({
      code,
      discountPercentage,
      validFrom,
      validUntil,
      usageLimit
    });
    res.status(201).json(newPromoCode);
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Retrieve all promo codes
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const promoCodes = await db.PromoCode.findAll();
    res.json(promoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update a promo code
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { code, discountPercentage, validFrom, validUntil, usageLimit } = req.body;
  try {
    const promoCode = await db.PromoCode.findByPk(id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    promoCode.code = code;
    promoCode.discountPercentage = discountPercentage;
    promoCode.validFrom = validFrom;
    promoCode.validUntil = validUntil;
    promoCode.usageLimit = usageLimit;
    
    await promoCode.save();
    res.json(promoCode);
  } catch (error) {
    console.error('Error updating promo code:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete a promo code
// Delete a promo code
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await db.PromoCode.findByPk(id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    await promoCode.destroy();
    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
