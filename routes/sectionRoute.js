const express = require("express");
const {
  create,
  update,
  read,
  deletes,
  insertOperation,
  deleteOperation,
  getallquizQuize,
  getallquizdata,
  insertallOperation,
} = require("../controllers/sectionController");
const { middlewareAuth } = require("../middleware/authMiddleware");
const router = express.Router();
// router.use()
// router.post('/question', question);
router.post("/create", middlewareAuth, create);
router.put("/update/:id", middlewareAuth, update);
router.delete("/delete/:id", middlewareAuth, deletes);
router.get("/read", middlewareAuth, read);
router.get("/read/:id", middlewareAuth, getallquizQuize);
router.get("/getall/:id", getallquizdata);
router.put("/insertquiz/:id", middlewareAuth, insertOperation);
router.post("/insertall", middlewareAuth, insertallOperation);
router.put("/deletetquiz/:id", middlewareAuth, deleteOperation);

// router.get('/getallquestion',getallquestion)
// router.post('/login', login);

module.exports = router;
