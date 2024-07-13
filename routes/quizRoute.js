const express = require('express');
const { quuiz,getAll,updatequizname,deletequizname,insertOrupdateQuestionsToQuiz, deletionofquestionIntosection, getallsectionquestion} = require('../controllers/quizeController');

const router = express.Router();

// router.post('/question', question);
router.post('/create', quuiz);
router.get('/getall',getAll)
router.put('/update/:id',updatequizname)
router.delete('/delete/:id',deletequizname)
router.get('/read/:id',getallsectionquestion)
router.put('/insert-questions/:id',insertOrupdateQuestionsToQuiz)
// router.put('/updatequestion/:id', updatequestion )
// router.delete('/deletequestion/:id', deletequestion )
// router.get('/quizemcqs/:quizename',getallquizequestion)
router.put('/deletequize-question/:id',deletionofquestionIntosection)
// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
