const mongoose = require('mongoose');

const ProjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  technologies: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
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





module.exports = mongoose.model('Project', ProjectsSchema);