const express = require('express');
const router = express.Router();
const db = require('../models'); // Ensure the correct path to your Sequelize models

const STORE_COORDINATES = { lat: 51.4916, lng: -0.1924 };

async function loadFetch() {
    const { default: fetch } = await import('node-fetch');
    return fetch;
}

router.get('/delivery-charge', async (req, res) => {
    const { distance } = req.query; // Expect distance in kilometers from the frontend
    try {
        const settings = await db.Settings.findOne({ where: { key: 'deliveryRate' } });
        const ratePerMile = settings ? settings.value.ratePerMile : 1; // Default rate if not set
        const cost = calculateDeliveryCost(distance, ratePerMile);
        res.json({ deliveryCost: cost });
    } catch (error) {
        console.error('Failed to fetch delivery settings:', error);
        res.status(500).json({ error: 'Error fetching delivery settings.' });
    }
});

function calculateDeliveryCost(distance, ratePerMile) {
    const ratePerKilometer = ratePerMile / 1.609; // Convert mile rate to kilometer rate
    return Math.ceil(distance * ratePerKilometer * 2) / 2; // Rounding to nearest 0.50
}

module.exports = router;
