const multer = require("multer");
const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: "005df6ddeea82d30000000003",
  applicationKey: "K005vhdyA34S1wOU9JpSpEYMIpRUPKE",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp"); // Set destination to /tmp directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can customize the filename if needed
  },
});
// const cacheDir = path.join(__dirname, '.cache', 'puppeteer');
// if (!fs.existsSync(cacheDir)) {
//   fs.mkdirSync(cacheDir, { recursive: true });
// }
const upload = multer({ storage: storage });

module.exports = { b2, upload };
