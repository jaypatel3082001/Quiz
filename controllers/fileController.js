const xlsx = require("xlsx");
const path = require("path");
const Questions = require("../models/questions");

async function UploadquestionFile(req, res) {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const { question, option1, option2, option3, option4, answer } = req.body;

    // Check if username exists using the User model
    // const existingQuestion = await Questions.findOne({ question });
    // if (existingQuestion) {
    //     return res.status(400).json({ message: 'question already exists' });
    // }
    const nwewArray = data.filter(async (ele) => {
      await Questions.create({
        question: ele.question,
        option1: ele.option1,
        option2: ele.option2,
        option3: ele.option3,
        option4: ele.option4,
        answer: ele.answer,
      });
    });
    //   const questions =

    res.json({ data: nwewArray });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error uploading file");
  }
}
module.exports = { UploadquestionFile };
