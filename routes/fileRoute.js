const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const {
  UploadquestionFile,
  downloadFile,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/questionupload", upload.single("file"), UploadquestionFile);
// router.post("/questioread", downloadFile);

module.exports = router;
