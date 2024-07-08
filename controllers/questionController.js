const Questions = require("../models/questions");
const Quize = require("../models/Quizearr");
const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');

async function question(req, res) {
  try {
    const { question, option1, option2, option3, option4, answer } = req.body;

    // Check if username exists using the User model
    // const existingQuestion = await Questions.findOne({ question });
    // if (existingQuestion) {
    //     return res.status(400).json({ message: 'question already exists' });
    // }
    const questions = await Questions.create({
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
    });

    res.status(201).json({ message: questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating user: ${err}` });
  }
}
async function updatequestion(req, res) {
  try {
    const { question, option1, option2, option3, option4, answer, weightage } =
      req.body;

    const allQuize = await Questions.findByIdAndUpdate(
      req.params.id,
      { question, option1, option2, option3, option4, answer, weightage },
      { new: true }
    );
    res.status(200).json({ data: allQuize });
  } catch (error) {}
}
async function deletequestion(req, res) {
  try {
    // const { questionid } = req.body;

    const allQuize = await Questions.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json("question deleted!");
  } catch (error) {
    console.log(error);
  }
}

async function getallquestion(req, res) {
  try {
    // const { quizename } = req.params;
    // const { questionid } = req.body;

    // const allQuize = await Questions.find({}).populate('quizemcqs');
    const quiz = await Questions.find({});

    console.log("popwwwww", quiz);

    // const quiii= await quiz
    if (!quiz) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
  }
}
async function getonequestion(req, res) {
  try {
    // const { quizename } = req.params;
    // const { questionid } = req.body;

    // const allQuize = await Questions.find({}).populate('quizemcqs');
    const quiz = await Questions.findById(req.params.id);

    console.log("popsssssss", quiz);

    // const quiii= await quiz
    // if (!quiz) {
    //     return res.status(404).json({ error: 'Question not found' });
    //   }
    res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  question,
  updatequestion,
  deletequestion,
  getallquestion,
  getonequestion,
};
