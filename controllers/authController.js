const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser');


// app.use(bodyParser.json());
exports.signup = async (req, res) => {
  try {
    const { username,email, password } = req.body;

    // Check if username exists using the User model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const user = new User({ username,email, password: hashedPassword });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ emailId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating user: ${err}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by username using the User model
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password with provided password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ emailId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};
