const multer = require("multer");
const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: "0054d4389953cf20000000001",
  applicationKey: "K005LmVnh1gEcuZbjYFoPe2RlgrwhAw",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp"); // Set destination to /tmp directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can customize the filename if needed
  },
});
const upload = multer({ storage: storage });

module.exports = { b2, upload };
