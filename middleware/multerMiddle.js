const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();

const uploadsDir = path.join(__dirname, "public/images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/images", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
