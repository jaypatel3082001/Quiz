const express = require('express');
const { question, updatequestion, deletequestion, getallquestion,getonequestion } = require('../controllers/questionController');
// const {  } = require('../controllers/questionController');
const { checkRole } = require('../middleware/hadlePath');
const { middlewareAuth } = require('../middleware/authMiddleware');
// const { quuiz,getAll,updatequizname,deletequizname,insertOrupdateQuestionsToQuiz, deletionofquestionIntoquize} = require('../controllers/quizeController');

const router = express.Router();
router.use(middlewareAuth);
router.post('/create',question);
// router.post('/quiz', quuiz);
// router.get('/getall',getAll)
// router.put('/update/:id',updatequizname)
// router.delete('/delete/:id',deletequizname)
// router.put('/insert-questions/:id',insertOrupdateQuestionsToQuiz)
router.put('/update/:id', updatequestion )
router.delete('/delete/:id', deletequestion )

// router.put('/deletequize-question/:id',deletionofquestionIntoquize)
router.get('/getallquestions',getallquestion)
router.get('/getallquestions/:id',getonequestion)
// router.post('/login', login);

module.exports = router;
