const mongoose = require("mongoose");
const QuestionModel = require("./Question").schema;
const EventSchema = new mongoose.Schema({
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
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  questions: [
    {
      type: QuestionModel,
    },
  ],
  studentEnroll: [
    {
      type: String,
    },
  ],
});

module.exports = EventModel = mongoose.model("event", EventSchema);
