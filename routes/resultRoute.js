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
router.use(middlewareAuth);
// router.post('/question', question);
router.post("/create", send);
router.get("/getresult", getresult);
router.get("/getalluserdata", middlewareAuth, getalluserresultdata);
router.get("/getall", getallresultdata);
router.get("/getresultsection/:id", readSection);
router.get("/read/:id", readOneresult);

router.get("/recentResults", recentResult);
router.get("/topTenResults", topTenResult);

module.exports = router;
