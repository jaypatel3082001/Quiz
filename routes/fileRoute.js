const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const {
  UploadquestionFile,
  getFileBackblazeByName,
} = require("../controllers/fileController");
const { middlewareAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(middlewareAuth);
router.post("/questionupload", upload.single("file"), UploadquestionFile);
router.get("/questioread/:fileName", getFileBackblazeByName);

module.exports = router;
