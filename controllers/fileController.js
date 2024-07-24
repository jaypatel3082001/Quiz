const xlsx = require("xlsx");
const fetch = require("node-fetch"); // If not already installed, install it
const { b2 } = require("../middleware/multerMiddle");
// const { generateDownloadLink } = require("./linkControllert");
const fs = require("fs");
const path = require("path");
const bucketId = "947d64b3985929e583fc0f12";
const bucketName = "KT-developer";
const Questions = require("../models/questions");

const axios = require("axios");

const Section = require("../models/Quizearr");
const env = require("dotenv");

env.config();
// let chromium = {};
let puppeteer;
// let asd=process.env.AWS_LAMBDA_FUNCTION_VERSION
// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
const chromium = require("@sparticuz/chromium");
puppeteer = require("puppeteer-core");
const puppeteerExtra = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
// } else {
//   puppeteer = require("puppeteer");
// }

// const UserAgent = require("user-agent");
async function UploadquestionFile(req, res) {
  try {
    const file = req.file;
    console.log("req.file", req.file); // Extract file information from request
    const fileName = req.file.originalname;
    const filePath = req.file.path;
    console.log("fileName", fileName);
    // const fileName = `${file.fieldname}-${Date.now()}${path.extname(
    //   file.originalname
    // )}`;
    // Authorize with Backblaze B2
    await b2.authorize();
    // const downloadResponse = await generateDownloadLink(fileName);
    // if (downloadResponse) {
    //   return res
    //     .status(400)
    //     .json(`Errr file already exsist ${downloadResponse}`);
    // }
    // Get upload URL
    // Check if a file with the same name already exists
    const existingFile = await getFileInfo(fileName);
    if (existingFile) {
      return res
        .status(400)
        .json({ error: `File already exists: ${existingFile.fileName}` });
    }
    // if(Date.now()-ExsitFile.uploadTimestamp)
    const {
      data: { uploadUrl, authorizationToken },
    } = await b2.getUploadUrl({
      bucketId: bucketId,
    });

    // console.log("downloadResponse", downloadResponse);
    // if (downloadResponse) {
    //   res.status(400).json("Errr file already exsist");
    // }
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

    res.status(201).json({ medd: fileName });
  } catch (err) {
    // console.error(err);
    res.status(500).send(`Error uploading file ${err} ${ExsitFile}`);
  }
}
async function getFileInfo(fileName) {
  try {
    const response = await b2.listFileNames({
      bucketId: "947d64b3985929e583fc0f12",
      fileNamePrefix: "upload/",
      maxFileCount: 1000, // Adjust as necessary for your needs
    });

    // Find the file with the matching name
    const fileInfo = response.data.files.find(
      (file) => file.fileName === "upload/" + fileName
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
// async function Uploadss(req, res) {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const fileName = file.originalname;
//     const filePath = file.path;

//     // Authorize with Backblaze B2
//     await b2.authorize();

//     // Get upload URL
//     const {
//       data: { uploadUrl, authorizationToken },
//     } = await b2.getUploadUrl({
//       bucketId: bucketId,
//     });

//     const myFile = fs.readFileSync(filePath);
//     await b2.uploadFile({
//       uploadUrl: uploadUrl,
//       uploadAuthToken: authorizationToken,
//       fileName: "upload/screenshot" + "/" + fileName,
//       data: myFile,
//     });

//     // // Upload file to Backblaze B2
//     // const uploadResponse = await b2.uploadFile({
//     //   uploadUrl,
//     //   uploadAuthToken: authorizationToken,
//     //   fileName,
//     //   data: file.buffer,
//     // });

//     // Construct the file download URL
//     // const fileDownloadUrl = `https://f000.backblazeb2.com/file/${bucketName}/upload/${fileName}`;

//     // Fetch the file from the download URL

//     res.status(201).json("Success");
//   } catch (err) {
//     // console.error(err);
//     res.status(500).send(`Error uploading file ${err} ${ExsitFile}`);
//   }
// }
async function Uploadss(req, res) {
  const url = "https://frontend-mo7y.vercel.app/userpages/quiz-start";
  const userAgent = req.header("user-agent"); // Get User-Agent from request

  try {
    // Fetch the page using Axios to verify if it works with the provided User-Agent
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": userAgent,
      },
    });

    // Configure Puppeteer options
    const options = {
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: false,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--disable-extensions"],
    };

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    // Set the same User-Agent in Puppeteer
    await page.setUserAgent(userAgent);

    await page.goto(url, { waitUntil: "networkidle0" });

    const dimensions = await page.evaluate(() => ({
      width: window.screen.width,
      height: window.screen.height,
    }));

    console.log(`Viewport dimensions: ${JSON.stringify(dimensions)}`);

    if (dimensions.width <= 0 || dimensions.height <= 0) {
      throw new Error(
        "Invalid viewport dimensions: width and height must be greater than 0."
      );
    }

    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      isMobile: false,
      isLandscape: true,
      hasTouch: false,
      deviceScaleFactor: 1,
    });

    const screenshotPath = "upload/";

    const takeScreenshot = async () => {
      const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fullScreenshotPath = `${screenshotPath}-${timestamp}.png`;
      const screenshotBuffer = await page.screenshot({ fullPage: true });

      console.log(`Screenshot taken`);

      await b2.uploadFile({
        uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: `upload/screenshot/${fullScreenshotPath}`,
        data: screenshotBuffer,
      });

      console.log(`Screenshot uploaded to B2`);
    };

    await takeScreenshot();

    browser.on("targetchanged", async (target) => {
      if (target.type() === "page") {
        const newPage = await target.page();
        const url = newPage.url();
        console.log(`Navigated to: ${url}`);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fullScreenshotPath = `${screenshotPath}-${timestamp}.png`;
        const screenshotBuffer = await newPage.screenshot({ fullPage: true });

        console.log(`Screenshot taken`);

        const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId });

        await b2.uploadFile({
          uploadUrl,
          uploadAuthToken: authorizationToken,
          fileName: `upload/screenshot/${fullScreenshotPath}`,
          data: screenshotBuffer,
        });

        console.log(`Screenshot uploaded to B2`);

        if (url === "https://frontend-mo7y.vercel.app/student/login") {
          await browser.close();
          return res.status(201).json("Exam is over");
        }
      }
    });

    console.log("Monitoring URL changes and taking screenshots...");
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).json(`Error: ${error.message}`);
  }
}

async function generateDownloadLink(fileName) {
  try {
    const authResponse = await b2.authorize();
    // console.log("Authorization response:", authResponse.data);

    // const bucketId = B2_BUCKET_ID;
    // const bucketName = B2_BUCKET_NAME;
    const bucketId = "947d64b3985929e583fc0f12";
    const bucketName = "KT-developer";

    const fileNamePrefix = "upload/"; // Ensure this is set correctly, example: 'sourceid/'
    const fullPath = `${fileNamePrefix}${fileName}`; // Full path includes the prefix

    const downloadAuth = await b2.getDownloadAuthorization({
      bucketId,
      fileNamePrefix,
      validDurationInSeconds: 3600, // Valid for 1 hour
      //b2ContentDisposition: 'inline'
    });
    console.log("downloadAuth", downloadAuth);

    // console.log("Download authorization response:", downloadAuth);

    if (!downloadAuth.data.authorizationToken) {
      throw new Error("Authorization token is undefined.");
    }
    console.log("authResponse.data.downloadUrl", authResponse.data.downloadUrl);
    const baseUrl = authResponse.data.downloadUrl + "/file/" + bucketName + "/";
    const presignedUrl = `${baseUrl}${fullPath}?Authorization=${downloadAuth.data.authorizationToken}`;
    console.log("presignedUrl", presignedUrl);

    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
}
async function getFileBackblazeByName(req, res) {
  try {
    const { fileName } = req.params;
    if (!fileName) {
      return res.status(404).json("File not provided");
      // return responseHandler.ResponseUnsuccess(res, "File not provided");
    }
    // Fetch the file from Backblaze B2 using the fileId
    const downloadResponse = await generateDownloadLink(fileName);
    // Handle potential errors (e.g., file not found, permission issues)
    if (!downloadResponse) {
      return res.status(404).json("File not provided");
    }
    const response = await fetch(downloadResponse);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the file using xlsx
    const workbook = xlsx.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const NewData = [];

    for (const ele of data) {
      if (
        ele.question &&
        ele.option1 &&
        ele.option2 &&
        ele.option3 &&
        ele.option4 &&
        (ele.answer === "option1" ||
          ele.answer === "option2" ||
          ele.answer === "option3" ||
          ele.answer === "option4")
      ) {
        const question = await Questions.create({
          question: ele.question,
          option1: ele.option1,
          option2: ele.option2,
          option3: ele.option3,
          option4: ele.option4,
          answer: ele.answer,
        });

        if (ele.uniqsecid) {
          const ABf = await Section.findOneAndUpdate(
            { uniqsecid: ele.uniqsecid },
            {
              $push: { sectionmcqs: question._id },
            },
            { new: true }
          );
          console.log("section data..", ABf);
          NewData.push(ABf);
        } else {
          NewData.push(question);
        }
      } else {
        return res.status(400).json(`error Invalid Data`);
      }
    }

    res.status(201).json({ data: NewData });
    // return responseHandler.ResponseSuccessMessageWithData(
    //   res,
    //   downloadResponse,
    //   "File fetched"
    // );
  } catch (error) {
    // console.error("Error fetching file:", error);
    return res.status(500).json(`error fetching while ${error}`);
  }
}

module.exports = { UploadquestionFile, getFileBackblazeByName, Uploadss };
