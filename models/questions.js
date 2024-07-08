const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  weightage: {
    type: Number,
    default: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Questions", questionSchema);
