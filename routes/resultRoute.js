const express = require("express");
const {
  send,
  getresult,
  getalluserresultdata,
  getallresultdata,
  readSection,
  readOneresult,
} = require("../controllers/resultController");
const { middlewareAuth } = require("../middleware/authMiddleware");
const {
  recentResult,
  topTenResult,
} = require("../controllers/dashBordController");

const router = express.Router();
// router.use(middlewareAuth);
// router.post('/question', question);
router.post("/create", middlewareAuth, send);
router.get("/getresult", middlewareAuth, getresult);
router.get("/getalluserdata", middlewareAuth, getalluserresultdata);
router.get("/getall", middlewareAuth, getallresultdata);
router.get("/getresultsection/:id", middlewareAuth, readSection);
router.get("/read/:id", middlewareAuth, readOneresult);

router.get("/recentResults", middlewareAuth, recentResult);
router.get("/topTenResults", middlewareAuth, topTenResult);

module.exports = router;
