const express = require("express");
const {
  getsearchAll,
  getsearchSection,
} = require("../controllers/serachContrller");
const { middlewareAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// router.post('/question', question);

router.get("/getsearchAll", middlewareAuth, getsearchAll);
router.get("/getsearchsection/:id", middlewareAuth, getsearchSection);

// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
