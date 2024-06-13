const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");
const Quize = require("../models/Quizearr");

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
    // await user.save();
    // const existingUser = await Section.findOne({ section });
    // const user= await User.findById(req.params.id)
    // if (!selectedSection) {
    //     return res.status(404).json("not found section")

    // }

    // console.log("ggg",section)
    // console.log("ggghhhh",user._id.toString())
    // const crethistory = await History.create({selectedUser: user._id,selectedSection:selectedSection})

    res.status(201).json({ data: allresult });

    // }

    // res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
}
// const countresult = (allData, questions) => {
//   let sum = 0;
//   let temparry = [];
//   //   questions.filter((ele)=>ele.isAttemoed);

//   allData.map((ele, ind) => {
//     // element.quizemcqs.map((que) => {
//     //   questions.map((ele, i) => {
//     //     if (ele.questionId === que._id) {
//     //       if (ele.answer === que.answer) {
//     //         sum = sum + que.weightage;
//     //       }
//     //     }
//     //   });
//     // });
//     // ele.quizemcqs
//     temparry = temparry.push(ele.quizemcqs);
//     // const children = ele.quizemcqs.concat(arr2);
//   });
//   //   let sum = 0;

//   // Create a Map for quick lookup from allData
//   const allDataMap = new Map(temparry.map((item) => [item.questionId, item]));

//   // Iterate over the questions and check answers
//   questions.forEach((question) => {
//     if (question.isAttempted) {
//       const correspondingData = allDataMap.get(question.questionId);
//       if (correspondingData && correspondingData.ans === question.ans) {
//         sum += correspondingData.weightage;
//       }
//     }
//   });

//   console.log("this is result...", sum);

//   return sum;
// };
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

module.exports = {
  send,
};
