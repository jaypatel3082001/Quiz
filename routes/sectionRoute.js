const express = require('express')
const {create,update,read,deletes,insertOperation,deleteOperation,getallsectionQuize,getallsectiondata} = require('../controllers/sectionController')
const router=express.Router()



// router.post('/question', question);
router.post('/create',create );
router.put('/update/:id',update );
router.delete('/delete/:id',deletes );
router.get('/read',read );
router.get('/read/:id',getallsectionQuize)
router.get('/getall/:id',getallsectiondata)
router.put('/insertquiz/:id',insertOperation );
router.put('/deletetquiz/:id',deleteOperation );

// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
