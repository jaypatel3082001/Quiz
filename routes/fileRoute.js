const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const { UploadquestionFile } = require("../controllers/fileController");

const router = express.Router();

router.post("/questionupload", upload.single("file"), UploadquestionFile);

module.exports = router;
