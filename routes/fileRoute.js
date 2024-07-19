const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const {
  UploadquestionFile,
  getFileBackblazeByName,
  Uploadss
} = require("../controllers/fileController");
const { middlewareAuth } = require("../middleware/authMiddleware");

const router = express.Router();
// router.use(middlewareAuth);
router.post(
  "/questionupload",
  upload.single("file"),
  middlewareAuth,
  UploadquestionFile
);
router.post("/ssupload", upload.single("file"), Uploadss);
router.get("/questioread/:fileName", middlewareAuth, getFileBackblazeByName);

module.exports = router;
