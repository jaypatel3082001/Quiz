const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  name: { type: String, unique: true },
});

module.exports = mongoose.model("Permission", PermissionSchema);
