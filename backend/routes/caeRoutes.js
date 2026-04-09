const express = require('express');
const router = express.Router();
const SavedAnalysis = require('../models/SavedAnalysis');

// Save CAE Analysis
router.post('/save-cae', async (req, res) => {
  try {
    const newEntry = new SavedAnalysis(req.body);
    await newEntry.save();
    res.status(201).send('Analysis saved');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all saved CAE analysis
router.get('/saved-cae', async (req, res) => {
  try {
    const data = await SavedAnalysis.find({ mode: 'cae' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }q
});

// Get single saved analysis by ID
router.get('/saved-cae/:id', async (req, res) => {
  try {
    const entry = await SavedAnalysis.findById(req.params.id);
    res.json(entry);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/compare-cae', async (req, res) => {
  const { id1, id2 } = req.body;

  try {
    const entry1 = await SavedAnalysis.findById(id1);
    const entry2 = await SavedAnalysis.findById(id2);

    if (!entry1 || !entry2) {
      return res.status(404).json({ message: 'One or both entries not found' });
    }

    res.json({ entry1, entry2 });
  } catch (err) {
    console.error('Compare error:', err);
    res.status(500).json({ message: 'Server error while comparing' });
  }
});

module.exports = router;
