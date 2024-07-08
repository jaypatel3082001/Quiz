// const mongoose = require('mongoose')

// const QuizeSchema = new mongoose.Schema({
//     quizemcx:[]

// })
const mongoose = require("mongoose");

const quizeSchema = new mongoose.Schema({
  quizemcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions" }],
  // id:{
  //     type:Number
  // },
  quizename: {
    type: String,
    required: true,
  },
  quizepassingMarks: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Quize", quizeSchema);
