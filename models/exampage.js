const mongoose = require("mongoose");

const exampageSchema = new mongoose.Schema({
    backgroundColor: {
        type: String,
        default:"black"
      },
      backgroundImage: {
        type: String,
        default:"black"
      },
      logo: {
        type: String,
        default:"black"
      },
},{
    timestamps:true
});

module.exports = mongoose.model("Exampage", exampageSchema);
