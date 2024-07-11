const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const {
  UploadquestionFile,
  getFileBackblazeByName,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/questionupload", upload.single("file"), UploadquestionFile);
router.post("/questioread", getFileBackblazeByName);

module.exports = router;
