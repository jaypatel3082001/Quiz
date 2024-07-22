const express = require("express");
const {
  getsearchAll,
  getsearchSection,
  getusersearchAll,
} = require("../controllers/serachContrller");
const { middlewareAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// router.post('/question', question);

router.get("/getsearchAll", middlewareAuth, getsearchAll);
router.get("/getusers", middlewareAuth, getusersearchAll);
router.get("/getsearchsection/:id", middlewareAuth, getsearchSection);

// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
