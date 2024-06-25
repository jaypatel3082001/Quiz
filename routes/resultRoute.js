const express = require("express");
const {
  send,
  getresult,
  getalluserresultdata,
  getallresultdata,
} = require("../controllers/resultController");
const { middlewareAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// router.post('/question', question);
router.post("/create", middlewareAuth, send);
router.get("/getresult", middlewareAuth, getresult);
router.get("/getalluserdata", middlewareAuth, getalluserresultdata);
router.get("/getall", getallresultdata);
// router.get("/getall", middlewareAuth, getallresultdata);
// router.get('/getall',getAll)
// router.put('/update/:id',updatequizname)
// router.delete('/delete/:id',deletequizname)
// router.get('/read/:id',getallquizequestion)
// router.put('/insert-questions/:id',insertOrupdateQuestionsToQuiz)
// // router.put('/updatequestion/:id', updatequestion )
// // router.delete('/deletequestion/:id', deletequestion )
// // router.get('/quizemcqs/:quizename',getallquizequestion)
// router.put('/deletequize-question/:id',deletionofquestionIntoquize)
// // router.get('/getallquestion',getallquestion)
// // router.post('/login', login);

module.exports = router;
