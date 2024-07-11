const xlsx = require("xlsx");
const fetch = require("node-fetch"); // If not already installed, install it
const { b2 } = require("../middleware/multerMiddle");
const fs = require("fs");
const path = require("path");
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

    // Fetch the file from the download URL

    res.status(201).json("Sucsee");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error uploading file ${err}`);
  }
}
// async function downloadFile(req, res) {
//   try {
//     // const file = req.file; // Extract file information from request
//     const fileName = req.query.file
//     // const filePath = req.file.path;
//     const downloadOpts = {
//       bucketId: bucketId,
//       fileName: "upload" + "/" + fileName,
//     };
//     const downloadResponse = await b2.downloadFileByName(downloadOpts);

//     // Save the downloaded file to a temporary path
//     const tempFilePath = path.join(__dirname, "tmp", fileName);
//     fs.writeFileSync(tempFilePath, downloadResponse.data);

//     // Read the Excel file
//     const workbook = xlsx.readFile(tempFilePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     // console.log("File downloaded successfully:", targetPath);
//     res.status(201).json({ data: data });
//   } catch (err) {
//     res.status(500).send(`Error uploading file ${err}`);
//   }
// }
async function getFileBackblazeByName(req, res) {
  try {
    const { fileName } = req.params;
    if (!fileName) {
      return responseHandler.ResponseUnsuccess(res, "File not provided");
    }
    // Fetch the file from Backblaze B2 using the fileId
    const downloadResponse = await backblazeService.generateDownloadLink(
      fileName
    );
    // Handle potential errors (e.g., file not found, permission issues)
    if (!downloadResponse) {
      return responseHandler.ResponseUnsuccess(res, "File not found");
    }

    return responseHandler.ResponseSuccessMessageWithData(
      res,
      downloadResponse,
      "File fetched"
    );
  } catch (error) {
    // console.error("Error fetching file:", error);
    return responseHandler.ResponseUnsuccess(res, "Error fetching file");
  }
}
async function generateDownloadLink(fileName) {
  try {
    const authResponse = await b2.authorize();
    // console.log("Authorization response:", authResponse.data);

    const bucketId = B2_BUCKET_ID;
    const bucketName = B2_BUCKET_NAME;

    const fileNamePrefix = "sourceid/"; // Ensure this is set correctly, example: 'sourceid/'
    const fullPath = `${fileNamePrefix}${fileName}`; // Full path includes the prefix

    const downloadAuth = await b2.getDownloadAuthorization({
      bucketId,
      fileNamePrefix,
      validDurationInSeconds: 3600, // Valid for 1 hour
      //b2ContentDisposition: 'inline'
    });

    // console.log("Download authorization response:", downloadAuth);

    if (!downloadAuth.data.authorizationToken) {
      throw new Error("Authorization token is undefined.");
    }

    const baseUrl = authResponse.data.downloadUrl + "/file/" + bucketName + "/";
    const presignedUrl = `${baseUrl}${fullPath}?Authorization=${downloadAuth.data.authorizationToken}`;

    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
}

module.exports = { UploadquestionFile, downloadFile };
