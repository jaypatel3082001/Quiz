const express = require("express");
const {
  getsearchAll,
  getsearchSection,
} = require("../controllers/serachContrller");

const router = express.Router();

// router.post('/question', question);

router.get("/getsearchAll", getsearchAll);
router.get("/getsearchsection/:id", getsearchSection);

// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
