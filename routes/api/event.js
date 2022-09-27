const express = require("express");
const { authUser } = require("../../middleware/auth");
const EventModel = require("../../models/EventModel");
const router = express.Router();
const User = require("../../models/User");

// @route   Get /api/event
// @desc    create event
// @access  Private

router.post("/create", authUser, async (req, res) => {
  const { title, description, imgUrl, startDate, endDate } = req.body;
  try {
    let event = new EventModel({
      title,
      description,
      imgUrl,
      startDate,
      endDate,
    });
    event.save();
    res.send({ success: event });
  } catch (e) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

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
// @desc    add enrollEvent
// @access  Public

router.post("/studentadd", async (req, res) => {
  const { event_id, student_id } = req.body;
  try {
    //TODO: doesn't working
    User.findById(student_id, (err, docs) => {
      if (err) {
        return res.status(403).send("student not found");
      }
    });

    EventModel.findById(event_id, async (err, event) => {
      if (err) {
        return res.status(404).json({ error: "event not found" });
      }
      await event.studentEnroll.push(student_id);
      await event.save();
      return res.send({ success: event });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
