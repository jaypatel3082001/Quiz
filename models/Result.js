const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }, //quize if require
    // question:,//quize if require
    questions: [
      {
        questionId: { type: String },
        question: { type: String },
        answer: { type: String },
        isAttempted: { type: Boolean },
        weightage: { type: Number },
      },
    ],
    result: { type: Number },
    startTime: { type: Date },
    endTime: { type: Date },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Result", resultSchema);
