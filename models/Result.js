const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstname: { type: String },
    lastname: { type: String },
    userEmail: { type: String },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, //quize if require
    Key: { type: mongoose.Schema.Types.ObjectId, ref: "Key" }, //quize if require
    // question:,//quize if require
    questions: [
      {
        questionId: { type: String },
        qindex: { type: Number },
        sectionId: { type: String }, // 2 - 3
        sectionname: { type: String },
        answer: { type: String },
        isAttempted: { type: Boolean },
        weightage: { type: Number }, // 2 - 3
      },
    ],
    result: { type: Number },
    sectionwiseResult: { type: Object },
    TotalResult: { type: Number },
    sectionwiseTotalResult: { type: Object },
    TotalPassing: { type: Number },
    status: { type: String },
    rightAnswers: { type: Object },
    startTime: { type: Date },
    endTime: { type: Date },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Result", resultSchema);
