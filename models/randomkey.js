
const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({

  key: {
    type: String,
  },
  time: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Key", keySchema);
