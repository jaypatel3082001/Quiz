const express = require("express");
const {
  signup,
  login,
  handleAdmin,
  userauth,
  userHandle,
  middlewareAuthrefresh,
} = require("../controllers/authController");
const { middlewareAuth } = require("../middleware/authMiddleware");
const { KeyAuth } = require("../middleware/keyMiddleware");
const { AdminAccess } = require("../controllers/adminController");
const {
  cutomeColor,
  getFileBackblazeByName,
} = require("../controllers/superAdminController");
const { upload } = require("../middleware/multerMiddle");
// const user = require('../models/user');
// const authchreckmid = ddd;
const router = express.Router();
// router.use(authchreckmid)
router.post("/signup", signup);
router.post("/userLogin", userHandle);
router.post("/login", login);
router.get("/admins", handleAdmin);
router.get("/alluser", middlewareAuth, userauth);
router.get("/protected", middlewareAuth, userauth);
router.post("/AdminAccess/:id", AdminAccess);
router.post(
  "/ExamLoginpage",
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  middlewareAuth,
  cutomeColor
);
router.get("/examlogin", getFileBackblazeByName);
router.get("/refreshToken", middlewareAuthrefresh);
// router.get('/protected-route', authenticateToken, async function hgj (req, res){
//     // If token is verified and not expired, you can access the decoded user ID
//     res.send('Access granted!');
// });

module.exports = router;
