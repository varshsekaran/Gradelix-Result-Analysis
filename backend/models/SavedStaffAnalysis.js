const mongoose = require('mongoose');

const SavedStaffAnalysisSchema = new mongoose.Schema({
  name: String,
  analysis: Array
}, {
  timestamps: true,
  collection: 'saved-staff-analysis'
});

module.exports = mongoose.model(
  'SavedStaffAnalysis',
  SavedStaffAnalysisSchema,
  'saved-staff-analysis'
);