const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");
const Quize = require("../models/Quizearr");
const User = require("../models/user");

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
    console.log("rrrrrrrrrrrrr", result);
    const allresult = await Result.create({
      userId: req.params.id,
      sectionId,
      questions,
      result: result,
    });

    res.status(201).json({ data: allresult });

    // }

    // res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
}

const countresult = (allData, questions) => {
  let sum = 0;
  let temparry = [];

  // Flatten all quizemcqs arrays into a single array
  allData.forEach((ele) => {
    temparry = temparry.concat(ele.quizemcqs);
  });

  // Ensure that each item has a _id property
  temparry = temparry.filter((item) => item._id !== undefined);

  // Create a Map for quick lookup from temparry using _id
  const allDataMap = new Map(
    temparry.map((item) => [item._id.toString(), item])
  );

  // Log the Map to ensure correct mapping
  console.log("mapppp", allDataMap);

  // Iterate over the questions and check answers
  questions.forEach((question) => {
    if (question.isAttempted) {
      // Ensure question.questionId is a string for Map lookup
      const correspondingData = allDataMap.get(question.questionId.toString());
      console.log("qqqqqqqqqq", correspondingData.answer);
      console.log("question:", question.answer);

      if (correspondingData.answer === question.answer) {
        sum += correspondingData.weightage;
        console.log("ffffff", correspondingData.weightage);
      }
    }
  });

  console.log("this is result...", sum);

  return sum;
};

async function getresult(req, res) {
  try {
    const { sectionId, userId } = req.query;
    const currentres = await Result.find({ userId });
    // console.log("jjdqqqdj", currentres);
    if (!currentres) {
      return res.status(404).json("User not found");
    }
    console.log("jjj", sectionId);
    const currentsec = await Result.find({ sectionId });
    // console.log("jrrrrrrrrrrjddj", currentsec);
    if (!currentsec) {
      return res.status(404).json("Section not found");
    }
    let new_arr = [];
    currentres.map((element, ind) => {
      currentsec.map((ele, i) => {
        if (element._id.toString() === ele._id.toString()) {
          new_arr = new_arr.concat(ele);
        }
      });
    });


    console.log("jjddfhfghj", userId);

    res.status(201).json({ data: new_arr });
  } catch (err) {
    res.status(500).json(`error while fetching request ${err}`);
  }
}

module.exports = {
  send,
  getresult,
};
