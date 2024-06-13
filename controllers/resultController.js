const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");

async function send(req, res) {
  try {
    const { sectionId, questions } = req.body; //user=req.params.id
    const selectedquestion = await Section.findById(sectionId).populate(
      "sectioninfo"
    );
    // let result=0
    if (!Array.isArray(selectedquestion.sectioninfo)) {
      return res.status(400).send("sectioninfo is not an array");
    }

    const allData = await Promise.all(
      selectedquestion.sectioninfo.map(async (ele) => {
        return await Quize.findById(ele).populate("quizemcqs");
      })
    );
    const result = countresult(allData, questions);
    // const existingUser = await Section.findOne({ section });
    // const user= await User.findById(req.params.id)
    // if (!selectedSection) {
    //     return res.status(404).json("not found section")

    // }

    // console.log("ggg",section)
    // console.log("ggghhhh",user._id.toString())
    // const crethistory = await History.create({selectedUser: user._id,selectedSection:selectedSection})

    res.status(201).json({ message: crethistory });

    // }

    // res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
}
const countresult = (allData, questions) => {
  sum = 0;

  allData.map((element, ind) => {
    element.quizemcqs.map((que) => {
      questions.map((ele, i) => {
        if (ele.questionId === que._id) {
          if (ele.answer === que.answer) {
            sum = sum + que.weightage;
          }
        }
      });
    });
  });
  return sum;
};
module.exports = {
  send,
};
