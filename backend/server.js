const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/caeRoutes'));
app.use('/api', require('./routes/semRoutes'));
app.use('/api', require('./routes/analysis')); // staff-subject route

// ⭐ ADD THIS BEFORE app.listen
const staffAnalysisRoutes = require('./routes/staffAnalysisRoutes');
app.use('/api', staffAnalysisRoutes);


// START SERVER (always last)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));