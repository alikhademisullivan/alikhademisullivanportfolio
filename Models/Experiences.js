const mongoose = require('mongoose');

const ExperiencesSchema = new mongoose.Schema({
    name: {
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
    },
    skills: {
      type: [String], // Array of strings to store multiple skills
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
    },
    Company: {
      type: String,
      required: true
    },
    positionName: {
      type: String,
      required: true
    }
  });




module.exports = mongoose.model('Experience', ExperiencesSchema);