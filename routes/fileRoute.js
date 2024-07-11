const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const {
  UploadquestionFile,
  getFileBackblazeByName,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/questionupload", upload.single("file"), UploadquestionFile);
router.get("/questioread/:fileName", getFileBackblazeByName);

module.exports = router;
