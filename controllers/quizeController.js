const Quize = require("../models/Quizearr");
const questions = require("../models/questions");
async function quuiz(req, res) {
  try {
    const { quizename, quizepassingMarks } = req.body;

    // Check if username exists using the User model
    const existingQuestion = await questions.findOne({ quizename });
    if (existingQuestion) {
      return res.status(400).json({ message: "quize already exists" });
    }
    const quizarr = new Quize({ quizename, quizepassingMarks });
    await quizarr.save();

    res.status(201).json({ data: quizarr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating user: ${err}` });
  }
}

async function getAll(req, res) {
  try {
    const allQuize = await Quize.find({}).populate("quizemcqs");
    res.status(200).json({ data: allQuize });
  } catch (error) {}
}
async function deletequizname(req, res) {
  try {
    const allQuize = await Quize.findOneAndDelete({ _id: req.params.id });
    res.status(200).json("data deleted!");
  } catch (error) {}
}
async function updatequizname(req, res) {
  try {
    const { quizename, quizepassingMarks } = req.body;
    const allQuize = await Quize.findByIdAndUpdate(
      req.params.id,
      { quizename, quizepassingMarks },
      { new: true }
    );
    res.status(200).json({ data: allQuize });
  } catch (error) {}
}

async function insertOrupdateQuestionsToQuiz(req, res) {
  try {
    console.log(req.parmas);

    const { questionId } = req.body;
    const quizarr = await Quize.findByIdAndUpdate(
      req.params.id,
      {
        $push: { quizemcqs: questionId },
      },
      { new: true }
    );
    // let totalQuestion = quizarr.quizemcqs.length;
    res.status(200).json({ data: quizarr });
  } catch (error) {
    console.error(error);
  }
}
async function deletionofquestionIntoquize(req, res) {
  try {
    const { questionId } = req.body;

    const exsitingques = await Quize.findById(req.params.id).populate(
      "quizemcqs"
    );
    const tempid = await questions.findById(questionId);

    const foundMCQs = exsitingques.quizemcqs.filter(
      (mcq) => mcq._id.toString() === tempid._id.toString()
    );

    if (tempid._id.toString() === foundMCQs[0]?._id.toString()) {
      const updatedquestions = await Quize.findByIdAndUpdate(req.params.id, {
        $pull: { quizemcqs: questionId },
      });
      res.status(200).json("question is deleted");
    } else {
      res.status(404).json({ messsage: "Not found" });
    }
  } catch (err) {
    console.log(err);
  }
}
async function getallquizequestion(req, res) {
  try {
    // const { questionid } = req.body;

    // const allQuize = await Questions.find({}).populate('quizemcqs');
    const quiz = await Quize.findById(req.params.id).populate("quizemcqs");

    console.log("pop", quiz);

    // const quiii= await quiz
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAll,
  quuiz,
  updatequizname,
  deletequizname,
  insertOrupdateQuestionsToQuiz,
  deletionofquestionIntoquize,
  getallquizequestion,
};
