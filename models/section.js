const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
  },
  quizinfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  PassingMarks: { type: Number },
  CountResult: { type: String },
  // uniqquizid: { type: Number, required: true },
  totalTime: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Quiz", quizSchema);
