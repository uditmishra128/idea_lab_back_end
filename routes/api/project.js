const express = require("express");
const { authUser } = require("../../middleware/auth");
const router = express.Router();
const ProjectModel = require("../../models/ProjectModel");
const { check, validationResult } = require("express-validator");

// @route   Get /api/project
// @desc    create project
// @access  Private

router.post(
  "/create",
  authUser,
  [
    check("title", "Title can not be empty").not().isEmpty(),
    check("description", "Description can't be empty").not().isEmpty(),
    check("imgUrl", "ImageUrl can't be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, imgUrl, githubLink, liveLink } = req.body;
    try {
      let project = new ProjectModel({
        title,
        description,
        imgUrl,
        githubLink,
        liveLink,
      });
      project.save();
      res.send({ success: project });
    } catch (e) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   Get /api/project
// @desc    get projects
// @access  Public

router.get("/getAll", (req, res) => {
  ProjectModel.find({}, function (err, result) {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      res.send({ success: result });
    }
  });
});

// @route   Get /api/project
// @desc    delete projecr
// @access  Private

router.delete("/:id", authUser, (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Enter a vaild id" });
  }
  ProjectModel.findOneAndDelete({ _id: req.params.id }, function (err, result) {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      console.log(result);
      res.send({ success: "Deleted Successfully" });
    }
  });
});
module.exports = router;
