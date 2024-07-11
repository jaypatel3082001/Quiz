const xlsx = require("xlsx");
const fetch = require("node-fetch"); // If not already installed, install it
const { b2 } = require("../middleware/multerMiddle");
const fs = require("fs");

const bucketId = "947d64b3985929e583fc0f12";
const bucketName = "KT-developer";

async function UploadquestionFile(req, res) {
  try {
    const file = req.file; // Extract file information from request
    const fileName = req.file.originalname;
    const filePath = req.file.path;
    // const fileName = `${file.fieldname}-${Date.now()}${path.extname(
    //   file.originalname
    // )}`;
    // Authorize with Backblaze B2
    await b2.authorize();

    // Get upload URL
    const {
      data: { uploadUrl, authorizationToken },
    } = await b2.getUploadUrl({
      bucketId: bucketId,
    });

    const myFile = fs.readFileSync(filePath);
    await b2.uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: "upload" + "/" + fileName,
      data: myFile,
    });

    // // Upload file to Backblaze B2
    // const uploadResponse = await b2.uploadFile({
    //   uploadUrl,
    //   uploadAuthToken: authorizationToken,
    //   fileName,
    //   data: file.buffer,
    // });

    // Construct the file download URL
    // const fileDownloadUrl = `https://f000.backblazeb2.com/file/${bucketName}/upload/${fileName}`;

    // // Fetch the file from the download URL
    // const response = await fetch(fileDownloadUrl);
    // const arrayBuffer = await response.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // // Process the file using xlsx
    // const workbook = xlsx.read(buffer);
    // const sheetName = workbook.SheetNames[0];
    // const sheet = workbook.Sheets[sheetName];
    // const data = xlsx.utils.sheet_to_json(sheet);

    res.status(201).json("sucess");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error uploading file ${err}`);
  }
}

module.exports = { UploadquestionFile };
