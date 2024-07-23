const Key = require("../models/randomkey");
const Exampage = require("../models/exampage");
const User = require("../models/user");
const xlsx = require("xlsx");
const fetch = require("node-fetch"); // If not already installed, install it
const { b2 } = require("../middleware/multerMiddle");
// const { generateDownloadLink } = require("./linkControllert");
const fs = require("fs");
const path = require("path");
const bucketId = "947d64b3985929e583fc0f12";
const bucketName = "KT-developer";
// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
var crypto = require("crypto");
const secreateKey = "HHls32";

async function cutomeColor(req, res) {
  try {
    const { backgroundColor } = req.body;
    const files = req.files;
    const backgroundImage = files.backgroundImage[0];
    const logo = files.logo[0];

    //   const existingKey = await Key.findOne({ key: key });
    //   if (!existingKey) {
    //     return res.status(400).json(`Key not found`);
    //   }
    //   existingKey.backgroundColor = backgroundColor;

    const backgroundImageFileName = backgroundImage.originalname;
    const backgroundImageFilePath = backgroundImage.path;
    const logoFileName = logo.originalname;
    const logoFilePath = logo.path;

    await b2.authorize();

    const existingFile1 = await getFileInfo(backgroundImageFileName);
    const existingFile2 = await getFileInfo(logoFileName);
    if (existingFile1 || existingFile2) {
      return res.status(400).json({ error: `File already exists` });
    }

    const {
      data: { uploadUrl, authorizationToken },
    } = await b2.getUploadUrl({
      bucketId: bucketId,
    });

    const backgroundImageData = fs.readFileSync(backgroundImageFilePath);
    await b2.uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `upload/exampageImg/${backgroundImageFileName}`,
      data: backgroundImageData,
    });

    const logoData = fs.readFileSync(logoFilePath);
    await b2.uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `upload/exampageImg/${logoFileName}`,
      data: logoData,
    });

    // Save the new field to the database (if needed)
    // Add the new field you want to save
    const asdsdf = await Exampage.create({
      backgroundColor: backgroundColor,
      backgroundImage: backgroundImageFileName,
      logo: logoFileName,
    });
    //   existingKey.backgroundImage = backgroundImageFileName;
    //   existingKey.logo = logoFileName; // Add the new field you want to save
    //   await existingKey.save();

    res.status(201).json({ data: asdsdf });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
}

async function getFileInfo(fileName) {
  try {
    const response = await b2.listFileNames({
      bucketId: "947d64b3985929e583fc0f12",
      fileNamePrefix: "upload/exampageImg",
      maxFileCount: 1000, // Adjust as necessary for your needs
    });

    // Find the file with the matching name
    const fileInfo = response.data.files.find(
      (file) => file.fileName === "upload/exampageImg" + fileName
    );

    if (fileInfo) {
      return fileInfo;
    } else {
      return null; // File not found
    }
  } catch (error) {
    console.error(`Error getting file info: ${error}`);
    throw error;
  }
}
module.exports = { cutomeColor };
