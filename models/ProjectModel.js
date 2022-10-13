const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
});

module.exports = ProjectModel = mongoose.model("project", ProjectSchema);
