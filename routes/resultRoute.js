const express = require("express");
const {
  send,
  getresult,
  getalluserresultdata,
  getallresultdata,
  readSection,
} = require("../controllers/resultController");
const { middlewareAuth } = require("../middleware/authMiddleware");
const { recentResult, topTenResult } = require("../controllers/dashBordController");

const router = express.Router();

// router.post('/question', question);
router.post("/create", middlewareAuth, send);
router.get("/getresult", middlewareAuth, getresult);
router.get("/getalluserdata", middlewareAuth, getalluserresultdata);
router.get("/getall", getallresultdata);
router.get("/getresultsection/:id", readSection);








router.get("/recentResults", recentResult);
router.get("/topTenResults", topTenResult);


module.exports = router;
