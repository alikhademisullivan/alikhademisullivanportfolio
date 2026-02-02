const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true,
    default: []
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skills', skillsSchema);
