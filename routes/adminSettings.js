// src/routes/adminSettings.js
const express = require('express');
const router = express.Router();
const db = require('../models'); // Import the db object that holds all your models
const _ = require('lodash');

// Correctly access Settings from the db object
const { Settings } = db;

// Fetch settings
router.get('/delivery-settings', async (req, res) => {
    try {
        const settings = await Settings.findAll();
        res.json(settings);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        res.status(500).json({ error: 'Error fetching settings.' });
    }
});

// Update settings
// Update settings
router.post('/update-settings', async (req, res) => {
    const { key, value } = req.body;
    try {
        const setting = await Settings.findOne({ where: { key } });
        if (setting) {
            // Deeply merges the existing value with the new value
            const updatedValue = _.merge({}, setting.value, value);
            await setting.update({ value: updatedValue });
            res.json({ message: "Settings updated successfully", setting });
        } else {
            // Create new setting if it does not exist
            const newSetting = await Settings.create({ key, value });
            res.status(201).json({ message: "Settings created successfully", setting: newSetting });
        }
    } catch (error) {
        console.error('Failed to update settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
