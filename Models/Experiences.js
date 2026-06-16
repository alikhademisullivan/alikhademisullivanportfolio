const mongoose = require('mongoose');

const ExperiencesSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: {
    type: [String],
    default: []
  },
  technologies: {
    type: [String],
    default: []
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false
  },
  logo: {
    type: String,
  },
  imageUrl: {
    type: String,
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

module.exports = mongoose.model('Experience', ExperiencesSchema);