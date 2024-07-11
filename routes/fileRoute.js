const express = require("express");
const { upload } = require("../middleware/multerMiddle");
const { UploadquestionFile } = require("../controllers/fileController");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const path = require("path");
// const fs = require("fs");
// const app = express();
const router = express.Router();

// app.use("/images", express.static(path.join(__dirname, "public/images")));
// // if (!fs.existsSync(uploadsDir)) {
// //   fs.mkdirSync(uploadsDir);
// // }
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// //   const upload = multer({ storage: storage });

// const upload = multer({ storage: storage });
// router.post("/uplodfile", upload.single("file"), UploadFile);

router.post("/questionupload", upload.single("file"), UploadquestionFile);
module.exports = router;
