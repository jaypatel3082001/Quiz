const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstname:{type:String},
    lastname:{type:String},
    userEmail:{type:String},
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }, //quize if require
    Key: { type: mongoose.Schema.Types.ObjectId, ref: "Key" }, //quize if require
    // question:,//quize if require
    questions: [
      {
        questionId: { type: String },
        qindex: { type: Number },
        quizeId: { type: String }, // 2 - 3
        quizename: { type: String },
        answer: { type: String },
        isAttempted: { type: Boolean },
        weightage: { type: Number }, // 2 - 3
      },
    ],
    result: { type: Number },
    quizewiseResult: { type: Object },
    TotalResult: { type: Number },
    quizewiseTotalResult: { type: Object },
    rightAnswers: { type: Object },
    startTime: { type: Date },
    endTime: { type: Date },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Result", resultSchema);
