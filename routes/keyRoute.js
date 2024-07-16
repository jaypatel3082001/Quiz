const express = require("express");
const {
  generatekey,
  fetchkey,
  updateKey,
  deleteKey,
} = require("../controllers/keyController");
const { middlewareAuth } = require("../middleware/authMiddleware");
// const { middlewareAuth } = require('../middleware/authMiddleware');
// const user = require('../models/user');
// const authchreckmid = ddd;
const router = express.Router();
// router.use(authchreckmid)
router.use(middlewareAuth);
router.post("/generatekey", generatekey);
router.get("/fetchkey", fetchkey);
router.get("/update/:id", updateKey);
router.put("/delete/:id", deleteKey);
// router.post('/login',login);
// router.get('/admins', handleAdmin);
// router.get('/protected', middlewareAuth,userauth);
// router.get('/protected-route', authenticateToken, async function hgj (req, res){
//     // If token is verified and not expired, you can access the decoded user ID
//     res.send('Access granted!');
// });

module.exports = router;
