const Key = require("../models/randomkey");
const User = require("../models/user");
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

      if (hoursDifference > 0 && ele.Remaintime>0) {
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
    const alldata = await Key.find({});
    let newArr = [];
    newArr = alldata.filter((ele) => {
      if (ele.Remaintime > 0) {
        return ele;
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

module.exports = { generatekey, fetchkey, updateKey, deleteKey };
