const User = require("../models/user");
// const Role = require('../models/admin');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokengen = require("../middleware/authMiddleware");
const Key = require("../models/randomkey");

exports.AdminAccess = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by username using the User model
    const Adminuser = await User.findById(req.params.id);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // Compare hashed password with provided password using bcrypt
    // const adminPipeline = [
    //   { $match: { email: 'admin@123.com', password :'admin123' } }
    // ];
    // const admin = await User.aggregate(adminPipeline);
    const ASSS = 'admin@123##@';
    const hashedPassword = await bcrypt.hash(ASSS, 10);
    // const hashedPassword2 = await bcrypt.hash("admin123", 10);
    console.log("first,", Adminuser.password);
    console.log("first,", hashedPassword);

    // role1=checkAdmin(email,password)
    const isMatch = await bcrypt.compare(ASSS, Adminuser.password);
    console.log("first,", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Admin" });
    }
    user.role = "Admin";
    //   if(user.role!=="Admin"){
    //     return res.status(401).json({ message: "Admin can Only access" });
    //   }
    // Generate a JWT token
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        role: user.role,
        user: user._id,
      },
      "Hs235",
      {
        expiresIn: "12h",
      }
    );
    await user.save();

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};
