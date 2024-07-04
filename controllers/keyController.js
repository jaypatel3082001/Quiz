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
    const { starttime, endtime, sectionId } = req.body;
    // Check if the section already exists
    const existingSec = await Key.findOne({ sectionId });
    if (existingSec) {
      if (existingSec.Endtime > Date.now()) {
        return res
          .status(400)
          .json("You cannot create a section that is already running");
      }
    }

    // Parse start and end times
    const date1 = new Date(starttime);
    const date2 = new Date(endtime);

    // Ensure date1 is before date2
    if (date1 > date2) {
      return res.status(400).json("Start time must be before end time");
    }

    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day

    // Calculate the difference in milliseconds
    const differenceInMs = date2.getTime() - date1.getTime();

    // Calculate the difference in days
    const daysDifference = Math.floor(differenceInMs / oneDay);

    // Generate a random key
    const randomKey = generateRandomKey(4);

    // Create the new section
    const create = await Key.create({
      key: randomKey,
      sectionId,
      Starttime: starttime,
      Endtime: endtime,
      Remaintime: daysDifference,
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
    res.status(201).json({ data: alldata });
  } catch (error) {
    res.status(500).json(`error ${error}`);
  }
}

module.exports = { generatekey,fetchkey };
