const express = require('express');
const { create } = require('../controllers/selectController');


const router = express.Router();

router.post('/create/:id', create);
// router.post('/quiz', quuiz);
// router.get('/getall',getAll)
// router.put('/update/:id',updatequizname)
// router.delete('/delete/:id',deletequizname)
// router.put('/insert-questions/:id',insertOrupdateQuestionsToQuiz)
// router.put('/updatequestion/:id', updatequestion )
// router.delete('/deletequestion/:id', deletequestion )
// router.get('/quizemcqs/:quizename',getallquizequestion)
// router.put('/deletequize-question/:id',deletionofquestionIntoquize)
// router.get('/getallquestion',getallquestion)
// // router.post('/login', login);

module.exports = router;
