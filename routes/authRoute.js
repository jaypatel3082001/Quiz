const express = require('express');
const { signup, login,handleAdmin } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
// const authchreckmid = ddd;
const router = express.Router();
// router.use(authchreckmid)
router.post('/signup',signup);
router.post('/login',login);
router.get('/admins', handleAdmin);
// router.get('/protected-route', authenticateToken, async function hgj (req, res){
//     // If token is verified and not expired, you can access the decoded user ID
//     res.send('Access granted!');
// });

module.exports = router;
