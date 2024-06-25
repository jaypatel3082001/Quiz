const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  sectioninfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quize" }],
  totalTime: { type: Number, default: 2 },
  createdAt: { type: Date,default: Date.now() },
});

module.exports = mongoose.model("Section", sectionSchema);
