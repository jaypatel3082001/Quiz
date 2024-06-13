const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }, //quize if require
    // question:,//quize if require
    questions: [
      {
        questionId: {
          type: string,
        },
        question: {
          type: string,
        },
        answer: {
          type: String,
        },
        isattamted: {
          type: Boolean,
        },
        weightage: {
          type: Number,
        },
      },
    ],
    result: {
      type: Number,
    },

    // perctage
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Result", resultSchema);
