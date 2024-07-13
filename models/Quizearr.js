// const mongoose = require('mongoose')

// const sectionSchema = new mongoose.Schema({
//     sectionmcx:[]

// })
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionmcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions" }],
  // id:{
  //     type:Number
  // },
  sectionname: {
    type: String,
    required: true,
  },
  uniqsecid:{
    type: Number,
    required: true,
  },
  sectionpassingMarks: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Section", sectionSchema);
