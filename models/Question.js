const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionDescription: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      validate: {
        validator: () => {
          return !(this.options.length >= 4);
        },
        message: (props) => `${props.value} exceeds maximum array size (4)!`,
      },
      required: true,
    },
  ],
  imgUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = QuestionModel = mongoose.model("question", QuestionSchema);
