const mongoose = require("mongoose");

const ProjectModel = mongoose.Schema({
  ProjectName: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EstimatedHours: {
    type: String,
    required: true,
  },
  Tools: {
    type: Array,
    required: true,
  },
  Methodology: {
    type: String,
    required: true,
  },
  Developers: {
    type: Number,
    required: true,
  },
  MobileApp: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Project", ProjectModel);
