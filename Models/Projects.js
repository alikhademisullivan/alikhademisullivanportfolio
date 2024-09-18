const mongoose = require('mongoose');

const ProjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  githublink: {
    type: String,
    required: true,
    unique: true
  },
  Description: {
    type: String,
  },
  Image: {
    data: String,
    contentType: String
  }

});





module.exports = mongoose.model('Project', ProjectsSchema);