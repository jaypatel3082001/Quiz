const express = require("express");
const { getsearchAll } = require("../controllers/serachContrller");

const router = express.Router();

// router.post('/question', question);

router.get("/getsearchAll", getsearchAll);

// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
