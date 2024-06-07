const express = require('express');
const { question, updatequestion, deletequestion, getallquizequestion, getallquestion } = require('../controllers/questionController');
// const { quuiz,getAll,updatequizname,deletequizname,insertOrupdateQuestionsToQuiz, deletionofquestionIntoquize} = require('../controllers/quizeController');

const router = express.Router();

router.post('/create', question);
// router.post('/quiz', quuiz);
// router.get('/getall',getAll)
// router.put('/update/:id',updatequizname)
// router.delete('/delete/:id',deletequizname)
// router.put('/insert-questions/:id',insertOrupdateQuestionsToQuiz)
router.put('/update/:id', updatequestion )
router.delete('/delete/:id', deletequestion )

// router.put('/deletequize-question/:id',deletionofquestionIntoquize)
router.get('/getallquestions',getallquestion)
// router.post('/login', login);

module.exports = router;
