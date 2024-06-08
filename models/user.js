// const mongoose = require("mongoose");
// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         require: true,
//         min: 3,
//         max: 20,
//         unique: true
//     },
//     email: {
//         type: String,
//         require: true,
//         max: 50,
//         unique: true
//     },
//     password: {
//         type: String,
//         require: true,
//         min: 6

//     },
//     profilePicture: {
//         type: String,
//         default: ""
//     },
//     isAdmin: {
//         type: Boolean,
//         default: true
//     },

// },
//     { timestamps: true }
// );

// module.exports = mongoose.model("User", UserSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true

  },
  password: {
    type: String,
    required: true
  },
  role: {
    type:String,
    default:'User'
  }
  
});

module.exports = mongoose.model('User', userSchema);
