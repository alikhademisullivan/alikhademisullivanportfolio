const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
