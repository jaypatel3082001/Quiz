// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: '
