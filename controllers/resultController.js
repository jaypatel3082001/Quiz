const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");
const Quize = require("../models/Quizearr");
const User = require("../models/user");

async function send(req, res) {
  try {
    const { sectionId, questions } = req.body; //user=req.params.id
    const { user } = req.user;
    console.log("user id....", user);
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
      userId: user,
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
      // console.log("questionid:", question.quizeId);

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
    const { sectionId } = req.query;
    const { user } = req.user;
    const currentres = await Result.find({ userId: user });
    // console.log("jjdqqqdj", currentres);
    if (!currentres) {
      return res.status(404).json("User not found");
    }
    console.log("jjjqqqqqq", currentres);
    console.log("jjj", sectionId);
    console.log("jjjkkk", user);
    const currentsec = await Result.find({ sectionId });

    // console.log("jrrrrrrrrrrjddj", currentsec);
    if (!currentsec) {
      return res.status(404).json("Section not found");
    }
    const exsistingsec = await Section.findById(sectionId);
    // let tempvariable;
    let totalresult = 0;
    let allanswer = [];
    // console.log("sec....", exsistingsec);
    const allDatares = await Promise.all(
      exsistingsec.sectioninfo.map(async (ele) => {
        const tempvariable = await Quize.findById(ele).populate("quizemcqs");
        // return tempvariable.quizemcqs
        // console.log("datamcq ............", ele);
        console.log("mcqs ............", tempvariable);
        tempvariable.quizemcqs.map(async (element) => {
          console.log("results ............", element.weightage);
          totalresult = totalresult + parseInt(element.weightage);
          const obje = {
            questionId: element._id.toString(),
            answer: element.answer,
          };
          // const obje = id6:`${element.answer}`
          // const obje = {id6 : `${element.answer}`};
          allanswer.push(obje);

          console.log("answer....", allanswer);
          // return allanswer;
        });
      })
    );
    console.log("results of all data", totalresult);

    console.log("answer", allanswer);
    // You can send the populated data as a response if needed

    let new_arr = [];
    currentres.map((element, ind) => {
      currentsec.map((ele, i) => {
        if (element._id.toString() === ele._id.toString()) {
          new_arr = new_arr.concat(ele);
        }
      });
    });

    // console.log("jjddfhfghj", userId);

    res.status(201).json({ data: { totalresult, allanswer, new_arr } });
  } catch (err) {
    res.status(500).json(`error while fetching request ${err}`);
  }
}

module.exports = {
  send,
  getresult,
};
