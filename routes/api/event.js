const express = require("express");
const { authUser } = require("../../middleware/auth");
const EventModel = require("../../models/EventModel");
const router = express.Router();
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   Get /api/event
// @desc    create event
// @access  Private

router.post(
  "/create",
  authUser,
  [
    check("title", "Title can not be empty").not().isEmpty(),
    check("description", "Description can't be empty").not().isEmpty(),
    check("startDate").trim().isDate().withMessage("Must be a valid date"),
    check("endDate").trim().isDate().withMessage("Must be a valid date"),
    // check("question", "plz add questions").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, imgUrl, startDate, endDate, question } =
      req.body;
    try {
      let event = new EventModel({
        title,
        description,
        imgUrl,
        startDate,
        endDate,
        question,
      });
      event.save();
      res.send({ success: event });
    } catch (e) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   Get /api/event
// @desc    get event
// @access  Public

router.get("/getAll", (req, res) => {
  EventModel.find({}, function (err, result) {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      res.send({ success: result });
    }
  });
});

// @route   Get /api/event
// @desc    delete event
// @access  Private

router.delete("/:id", authUser, (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Enter a vaild id" });
  }
  EventModel.findOneAndDelete({ _id: req.params.id }, function (err, result) {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      res.send({ success: "Deleted Successfully" });
    }
  });
});

// @route   Get /api/event
// @desc    get event by id
// @access  Public

router.get("/get/:id", (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Enter a vaild id" });
  }
  EventModel.findById(req.params.id, function (err, result) {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      res.send({ success: result });
    }
  });
});

// @route   Get /api/event
// @desc    add enrollEvent
// @access  Public

router.post("/studentadd", async (req, res) => {
  const { event_id, student_id } = req.body;
  if (
    !student_id.match(/^[0-9a-fA-F]{24}$/) ||
    !event_id.match(/^[0-9a-fA-F]{24}$/)
  ) {
    return res.status(400).json({ error: "Enter a vaild id" });
  }
  try {
    let user = await User.findById(student_id);
    if (user) {
      let event = await EventModel.findById(event_id);
      if (event) {
        if (event.studentEnroll.includes(student_id)) {
          return res.status(400).json({ error: "student already enrolled" });
        } else {
          event.studentEnroll.push(student_id);
          await event.save();
          return res.send({ success: event });
        }
      } else {
        return res.status(404).json({ error: "event not found" });
      }
    } else {
      return res.status(403).json({ error: "student not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
