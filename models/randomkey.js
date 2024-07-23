const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  key: {
    type: String,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  Starttime: {
    type: Date,
  },
  Endtime: {
    type: Date,
  },
  Remaintime: {
    type: Number,
  },
  backgroundColor: {
    type: String,
    default:"black"
  },
  backgroundImage: {
    type: String,
    default:"black"
  },
  logo: {
    type: String,
    default:"black"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Key", keySchema);
