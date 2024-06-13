const express = require("express");
const { send } = require("../controllers/resultController");

const router = express.Router();

// router.post('/question', question);
router.post("/create/:id", send);
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
