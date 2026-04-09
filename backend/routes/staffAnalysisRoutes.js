const express = require('express');
const router = express.Router();
const SavedStaffAnalysis = require('../models/SavedStaffAnalysis');


// Save Staff Analysis
router.post('/save-staff', async (req, res) => {
  try {

    const newEntry = new SavedStaffAnalysis(req.body);
    await newEntry.save();

    res.status(201).json({ message: 'Staff analysis saved successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all saved staff analyses
router.get('/saved-staff', async (req, res) => {

  try {

    const data = await SavedStaffAnalysis
      .find()
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }
});


// Compare Staff Analysis
router.post('/compare-staff', async (req, res) => {

  const { id1, id2 } = req.body;

  try {

    const entry1 = await SavedStaffAnalysis.findById(id1);
    const entry2 = await SavedStaffAnalysis.findById(id2);

    if (!entry1 || !entry2) {
      return res.status(404).json({
        message: 'One or both staff analyses not found'
      });
    }

    res.json({ entry1, entry2 });

  } catch (err) {

    res.status(500).json({
      message: 'Server error while comparing staff analyses'
    });

  }
});

module.exports = router;