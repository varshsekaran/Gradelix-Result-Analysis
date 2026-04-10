const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HOD = require('../models/Dean');



// Login HOD
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hod = await HOD.findOne({ email });
    if (!hod) return res.status(400).json({ msg: 'HOD not found' });

    const isMatch = await bcrypt.compare(password, hod.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: hod._id }, process.env.JWT_SECRET);
    res.json({ token, hod: { id: hod._id, email: hod.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
