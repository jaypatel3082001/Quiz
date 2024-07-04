const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  key: {
    type: String,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Key", keySchema);
