const Key = require("../models/randomkey");
const User = require("../models/user");
const xlsx = require("xlsx");
const fetch = require("node-fetch"); // If not already installed, install it
const { b2 } = require("../middleware/multerMiddle");
// const { generateDownloadLink } = require("./linkControllert");
const fs = require("fs");
const path = require("path");
const bucketId = "2d5f461dfdaeae7a98020d13";
const bucketName = "DemoPRoject";
// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
var crypto = require("crypto");
const secreateKey = "HHls32";
// console.log();

async function generatekey(req, res) {
  try {
    const { starttime, endtime, quizId } = req.body;

    // Check if the section already exists
    const existingSec = await Key.find({ quizId });
    const oneHour = 1000 * 60 * 60;
    const now = Date.now();

    let newArr = [];
    for (const ele of existingSec) {
      const differenceInMs = ele.Endtime.getTime() - now;
      const hoursDifference = Math.floor(differenceInMs / oneHour);

      if (hoursDifference > 0 && ele.Remaintime > 0) {
        newArr.push(ele);
      } else {
        ele.Remaintime = 0;
        await Key.findByIdAndUpdate(ele._id, { Remaintime: ele.Remaintime });
      }
    }

    if (newArr.length > 0) {
      return res
        .status(400)
        .json("You cannot create a Quiz that is already running");
    }

    // Parse start and end times
    const date1 = new Date(starttime);
    const date2 = new Date(endtime);

    // Ensure date1 is before date2
    if (date1 > date2) {
      return res.status(400).json("Start time must be before end time");
    }

    // Calculate the difference in milliseconds
    const differenceInMs = date2.getTime() - date1.getTime();
    const hoursDifference = Math.floor(differenceInMs / oneHour);

    if (hoursDifference <= 0) {
      return res
        .status(400)
        .json("End time must be at least one hour after start time");
    }

    // Generate a random key
    const randomKey = generateRandomKey(4);

    // Create the new section
    const create = await Key.create({
      key: randomKey,
      quizId,
      Starttime: date1,
      Endtime: date2,
      Remaintime: hoursDifference,
    });

    res.status(201).json({ data: create });
  } catch (error) {
    res.status(500).json(`Error: ${error.message}`);
  }
}
function generateRandomKey(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function fetchkey(req, res) {
  try {
    const alldata = await Key.find({}).populate("quizId");
    let newArr = [];
    const oneHour = 1000 * 60 * 60;
    newArr = alldata.filter((ele) => {
      const differenceInMs = ele.Endtime.getTime() - Date.now();

      // console.log("differenceInMs", differenceInMs);

      const hoursDifference = Math.floor(differenceInMs / oneHour);
      if (hoursDifference > 0) {
        if (ele.Remaintime > 0) {
          return ele;
        }
      }
    });
    res.status(201).json({ data: newArr });
  } catch (error) {
    res.status(500).json(`error ${error}`);
  }
}
// async function fetchOkey(req, res) {
//   try {
//     const alldata = await Key.find({});
//     res.status(201).json({ data: alldata });
//   } catch (error) {
//     res.status(500).json(`error ${error}`);
//   }
// }
async function updateKey(req, res) {
  try {
    const alldata = await Key.find({ quizId: req.params.id });
    let aballdata;

    if (alldata.length === 0) {
      return res.status(404).json("Section not found");
    }
    aballdata = alldata.filter((ele) => {
      if (ele.Remaintime !== 0) {
        return { ele };
      }
    });

    console.log("alldata", aballdata);
    console.log("Date.now()", Date.now());
    console.log("alldata.Endtime.getTime()", aballdata[0].Endtime.getTime());

    const differenceInMs = aballdata[0].Endtime.getTime() - Date.now();
    const oneHour = 1000 * 60 * 60;
    console.log("differenceInMs", differenceInMs);

    const hoursDifference = Math.floor(differenceInMs / oneHour);

    if (hoursDifference <= 0) {
      return res.status(400).json("Your key has expired");
    }

    aballdata[0].Remaintime = hoursDifference;
    const updatedData = await aballdata[0].save();

    res.status(200).json({ data: updatedData });
  } catch (error) {
    res.status(500).json(`Error: ${error.message}`);
  }
}

async function deleteKey(req, res) {
  try {
    const deletedKey = await Key.findById(req.params.id);
    deletedKey.Remaintime = 0;
    const updatedData = await deletedKey.save();
    res.status(201).json("Key is Deleted");
  } catch (error) {
    res.status(500).json(` error hwile fetching ${error}`);
  }
}

async function cutomeColor(req, res) {
  try {
    const { backgroundColor, key } = req.body;
    const files = req.files;
    const backgroundImage = files.backgroundImage[0];
    const logo = files.logo[0];

    const existingKey = await Key.findOne({ key: key });
    if (!existingKey) {
      return res.status(400).json(`Key not found`);
    }
    existingKey.backgroundColor = backgroundColor;

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
      fileName: `upload/examImg/${backgroundImageFileName}`,
      data: backgroundImageData,
    });

    const logoData = fs.readFileSync(logoFilePath);
    await b2.uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `upload/examImg/${logoFileName}`,
      data: logoData,
    });

    // Save the new field to the database (if needed)
    // Add the new field you want to save
    existingKey.backgroundImage = backgroundImageFileName;
    existingKey.logo = logoFileName; // Add the new field you want to save
    await existingKey.save();

    res.status(201).json("Successfully uploaded files and updated database");
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
}

async function getFileInfo(fileName) {
  try {
    const response = await b2.listFileNames({
      bucketId: "2d5f461dfdaeae7a98020d13",
      fileNamePrefix: "upload/examImg",
      maxFileCount: 1000, // Adjust as necessary for your needs
    });

    // Find the file with the matching name
    const fileInfo = response.data.files.find(
      (file) => file.fileName === "upload/examImg" + fileName
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

// async function download

async function generateDownloadLink(fileName) {
  try {
    const authResponse = await b2.authorize();
    // console.log("Authorization response:", authResponse.data);

    // const bucketId = B2_BUCKET_ID;
    // const bucketName = B2_BUCKET_NAME;
    const bucketId = "2d5f461dfdaeae7a98020d13";
    const bucketName = "DemoPRoject";

    const fileNamePrefix = "upload/examImg"; // Ensure this is set correctly, example: 'sourceid/'
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
async function getFileBackblazeByNameforKey(req, res) {
  try {

      const exsitExampage= await Exampage.aggregate([
          {
            $match:{
              key:req.params.id
            }
          },
      ])


    const  backgroundImgName  = exsitExampage[0].backgroundImage;
    const  logoName  = exsitExampage[0].logo;
  //   if (!fileName) {
  //     return res.status(404).json("File not provided");
  //     // return responseHandler.ResponseUnsuccess(res, "File not provided");
  //   }
    // Fetch the file from Backblaze B2 using the fileId
    const downloadResponse1 = await generateDownloadLink(backgroundImgName);
    const downloadResponse2 = await generateDownloadLink(logoName);
    // Handle potential errors (e.g., file not found, permission issues)
    if (!downloadResponse1) {
      return res.status(404).json("File not provided");
    }
    if (!downloadResponse2) {
      return res.status(404).json("File not provided");
    }
    // const response1 = await fetch(downloadResponse1);
    // const response2 = await fetch(downloadResponse2);
    // const arrayBuffer1 = await response1.arrayBuffer();
    // const arrayBuffer2 = await response2.arrayBuffer();
    // const buffer1 = Buffer.from(arrayBuffer1);
    // const buffer2 = Buffer.from(arrayBuffer2);

    // Process the file using xlsx
   

    res.status(201).json({backgroundImage:downloadResponse1,logo:downloadResponse2,backgroundColor:exsitExampage[0].backgroundColor});
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

module.exports = { generatekey, fetchkey, updateKey, deleteKey, cutomeColor,getFileBackblazeByNameforKey };
