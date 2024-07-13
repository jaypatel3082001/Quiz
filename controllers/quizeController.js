const Section = require("../models/Quizearr");
const questions = require("../models/questions");
async function quuiz(req, res) {
  try {
    const { sectionname, sectionpassingMarks } = req.body;

    // Check if username exists using the User model
    const existingQuestion = await Section.findOne({ sectionname });
    if (existingQuestion) {
      return res.status(400).json({ message: "section already exists" });
    }

    let uniqsecid;
    let isUnique = false;

    while (!isUnique) {
      uniqsecid = parseInt(RandomGenerator());
      const existingNum = await Section.findOne({ uniqsecid });
      if (!existingNum) {
        isUnique = true;
      }
    }

    // if()
    const quizarr = new Section({ sectionname, sectionpassingMarks, uniqsecid });
    await quizarr.save();

    res.status(201).json({ data: quizarr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating user: ${err}` });
  }
}

async function getAll(req, res) {
  try {
    const allsection = await Section.find({}).populate("sectionmcqs");
    res.status(200).json({ data: allsection });
  } catch (error) {}
}
async function deletequizname(req, res) {
  try {
    const allsection = await Section.findOneAndDelete({ _id: req.params.id });
    res.status(200).json("data deleted!");
  } catch (error) {}
}
async function updatequizname(req, res) {
  try {
    const { sectionname, sectionpassingMarks } = req.body;

    const allsection = await Section.findByIdAndUpdate(
      req.params.id,
      { sectionname, sectionpassingMarks },
      { new: true }
    );
    res.status(200).json({ data: allsection });
  } catch (error) {}
}


async function insertOrupdateQuestionsToQuiz(req, res) {
  try {
    console.log(req.parmas);

    const { questionId } = req.body;
    const quizarr = await Section.findByIdAndUpdate(
      req.params.id,
      {
        $push: { sectionmcqs: questionId },
      },
      { new: true }
    );
    // let totalQuestion = quizarr.sectionmcqs.length;
    res.status(200).json({ data: quizarr });
  } catch (error) {
    console.error(error);
  }
}
async function deletionofquestionIntosection(req, res) {
  try {
    const { questionId } = req.body;

    const exsitingques = await Section.findById(req.params.id).populate(
      "sectionmcqs"
    );
    const tempid = await questions.findById(questionId);

    const foundMCQs = exsitingques.sectionmcqs.filter(
      (mcq) => mcq._id.toString() === tempid._id.toString()
    );

    if (tempid._id.toString() === foundMCQs[0]?._id.toString()) {
      const updatedquestions = await Section.findByIdAndUpdate(req.params.id, {
        $pull: { sectionmcqs: questionId },
      });
      res.status(200).json("question is deleted");
    } else {
      res.status(404).json({ messsage: "Not found" });
    }
  } catch (err) {
    console.log(err);
  }
}
async function getallsectionquestion(req, res) {
  try {
    // const { questionid } = req.body;

    // const allsection = await Questions.find({}).populate('sectionmcqs');
    const quiz = await Section.findById(req.params.id).populate("sectionmcqs");

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
function RandomGenerator() {
  let RandomNum = "";
  for (let i = 0; i < 6; i++) {
    const numr = Math.floor(Math.random() * 10);
    RandomNum = RandomNum + `${numr}`;
  }
  return RandomNum;
}
module.exports = {
  getAll,
  quuiz,
  updatequizname,
  deletequizname,
  insertOrupdateQuestionsToQuiz,
  deletionofquestionIntosection,
  getallsectionquestion,
};
