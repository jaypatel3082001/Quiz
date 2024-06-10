const express = require('express');
const { signup, login,handleAdmin } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
// const authchreckmid = ddd;
const router = express.Router();
// router.use(authchreckmid)
router.post('/signup',signup);
router.post('/login',login);
router.get('/admins', handleAdmin);

module.exports = router;
