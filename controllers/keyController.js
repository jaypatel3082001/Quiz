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
    const { time, sectionId } = req.body;

    // const {time}=req.body
    const randomKey = generateRandomKey(4);
    const create = await Key.create({
      time: time,
      key: randomKey,
      sectionId: sectionId,
    });

    res.status(201).json({ data: create });
  } catch (error) {
    res.status(500).json(`error ...${error}`);
  }
}
function generateRandomKey(length) {
  return crypto.randomBytes(length).toString("hex");
}
module.exports = { generatekey };
