const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");
const Quize = require("../models/Quizearr");
const User = require("../models/user");

async function send(req, res) {
  try {
    const { sectionId, questions } = req.body; //user=req.params.id
    const { user } = req.user;
    // console.log("user id....", user);
    const selectedquestion = await Section.findById(sectionId).populate(
      "sectioninfo"
    );
    // let Totalres;
    // currentuser.result
    // let result=0
    if (!Array.isArray(selectedquestion.sectioninfo)) {
      return res.status(400).send("sectioninfo is not an array");
    }

    const allData = await DataFun(selectedquestion);
    // console.log("jascript.....", allData[0].quizemcqs);
    console.log("all datfun return", allData);
    const result = countResult(allData.tempvariable, questions);
    // const totalquizeresult = totalquizeResult(questions);
    console.log("rrrrrrrrrrrrr", result);
    const allresult = await Result.create({
      userId: user,
      sectionId,
      questions,
      result: result.sum,
      quizewiseResult: result.weightageCounter,
      TotalResult: allData.totalresult,
      quizewiseTotalResult: allData.weightageCounter,
      rightAnswers: allData.allanswer,
    });
    const currentuser = await User.findByIdAndUpdate(
      user,
      {
        $push: { result: allresult },
      },
      { new: true }
    );
    res.status(201).json({ data: allresult });

    // }

    // res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
}

const countResult = (allData, questions) => {
  let sum = 0;
  let temparry = [];
  let weightageCounter = {};

  // Flatten all quizemcqs arrays into a single array
  allData.forEach((ele) => {
    if (ele && ele.quizemcqs) {
      temparry = temparry.concat(ele.quizemcqs);
    }
  });

  // Ensure that each item has a _id property
  temparry = temparry.filter((item) => item && item._id);

  // Create a Map for quick lookup from temparry using _id
  const allDataMap = new Map(
    temparry.map((item) => [item._id.toString(), item])
  );

  // Log the Map to ensure correct mapping
  // console.log("Map:", allDataMap);

  // Iterate over the questions and check answers
  questions.forEach((question) => {
    let qId = question.quizeId;
    if (question.isAttempted) {
      const correspondingData = allDataMap.get(question.questionId);
      // console.log("question............:", question);
      // console.log(" db -- question............:", correspondingData);
      if (correspondingData && correspondingData.answer === question.answer) {
        sum = sum + correspondingData.weightage;
        // console.log("ffffff", correspondingData.weightage);
        if (weightageCounter[qId]) {
          weightageCounter[qId] += correspondingData.weightage;
        } else {
          // If qId is not in the dictionary, initialize it
          weightageCounter[qId] = correspondingData.weightage;
          // console.log("inner if...wait", weightageCounter);
        }
      }
    }
  });

  // console.log("Final result:", sum);
  return { sum, weightageCounter };
};
const totalquizeResult = (questions) => {
  let weightageCounter = {};

  // Iterate over new_arr

  // Iterate over questions in each element
  questions.quizemcqs.forEach((question) => {
    let qId = question._id;
    let weightage = parseInt(question.weightage);
    // console.log("inner wait", weightage);

    // If qId is already in the dictionary, add the weightage
    if (weightageCounter[qId]) {
      weightageCounter[qId] += weightage;
    } else {
      // If qId is not in the dictionary, initialize it
      weightageCounter[qId] = weightage;
      // console.log("inner if...wait", weightageCounter);
    }
  });

  return weightageCounter;
};
// const findTotalresult = (totalresult, allanswer, tempvariable) => {
//   // console.log("sec....", exsistingsec);
//   // const allDatares = await Promise.all(
//   //   exsistingsec.sectioninfo.map(async (ele) => {
//   //     const tempvariable = await Quize.findById(ele).populate("quizemcqs");
//   // return tempvariable.quizemcqs
//   // console.log("datamcq ............", ele);
//   console.log("mcqs ............", tempvariable);
//   tempvariable.quizemcqs.map(async (element) => {
//     console.log("results ............", element.weightage);
//     totalresult = totalresult + parseInt(element.weightage);
//     const obje = {
//       questionId: element._id.toString(),
//       answer: element.answer,
//     };
//     // const obje = id6:`${element.answer}`
//     // const obje = {id6 : `${element.answer}`};
//     allanswer.push(obje);

//     console.log("answer123....", allanswer);
//     // return allanswer;
//   });
//   // })
//   // );
//   console.log("results of all data", totalresult);
//   return totalresult;
// };
const DataFun = async (selectedquestion) => {
  let totalresult = 0;
  let allanswer = [];
  let tempvariable = [];
  let weightageCounter = {};
  // let totalquizeresult;

  // Use for...of to handle asynchronous operations
  for (const ele of selectedquestion.sectioninfo) {
    tf = await Quize.findById(ele).populate("quizemcqs");
    tempvariable.push(tf);
    let qId = ele._id;
    //  totalquizeresult = totalquizeResult(tf);
    for (const element of tf.quizemcqs) {
      // totalquizeresult = totalquizeResult(element);
      console.log("results ............", element.weightage);

      totalresult += parseInt(element.weightage);
      if (weightageCounter[qId]) {
        weightageCounter[qId] += element.weightage;
      } else {
        // If qId is not in the dictionary, initialize it
        weightageCounter[qId] = element.weightage;
        // console.log("inner if...wait", weightageCounter);
      }

      const obje = {
        questionId: element._id.toString(),
        answer: element.answer,
      };

      allanswer.push(obje);
    }

    // console.log("tempvariable ............", tempvariable);
  }

  // console.log("results of all data", totalresult);
  return { totalresult, allanswer, tempvariable, weightageCounter };
};

async function getresult(req, res) {
  try {
    const { sectionId } = req.query;
    const { user } = req.user;
    const currentres = await User.findById(user).populate("result");
    // console.log("jjdqqqdj", currentres);
    if (!currentres) {
      return res.status(404).json("User not found");
    }
    let new_arr = currentres.result;
    console.log("jjjqqqqqq...hekko", new_arr);
    console.log("jjj", sectionId);
    console.log("jjjkkk", user);
    const currentsec = await Result.find({ sectionId });

    console.log("jrrrrrrrrrrjddj", currentsec);
    // if (!currentsec) {
    //   return res.status(404).json("Section not found");
    // }
    const exsistingsec = await Section.findById(sectionId);
    // let tempvariable;

    // let qId,
    //   nnnewarr = [],
    //   qwisemarks = 0;
    // console.log("answer", allanswer);
    // const weitageCounter = (qId1, marks) => {
    //   console.log("quize>>>id", qId);
    // };
    // new_arr.map((ele) => {
    //   nnnewarr = ele.questions.find((elements) => {

    //     if (qId === elements.quizeId) {
    //       qwisemarks=qwisemarks+elements.weightage
    //       return elements;
    //     } else {
    //       qId = elements.quizeId;
    //     }
    //     // qId.push(elements.quizeId);
    //     // return elements.quizeId

    //     // weitageCounter(elements.quizeId, elements.weightage);
    //   });
    // });
    // let weightageCounter = {};

    // // Iterate over new_arr
    // new_arr.forEach((ele) => {
    //   // Iterate over questions in each element
    //   ele.questions.forEach((question) => {
    //     let qId = question.quizeId;
    //     let weightage = parseInt(question.weightage);
    //     console.log("inner wait", weightage);

    //     // If qId is already in the dictionary, add the weightage
    //     if (weightageCounter[qId]) {
    //       weightageCounter[qId] += weightage;
    //     } else {
    //       // If qId is not in the dictionary, initialize it
    //       weightageCounter[qId] = weightage;
    //       console.log("inner if...wait", weightageCounter);
    //     }
    //   });
    // });

    // console.log("quize id not repe", weightageCounter);
    // console.log("quize id not iiiiiiiiiii repe", nnnewarr);
    // console.log("quize id not repe", qwisemarks);
    // You can send the populated data as a response if needed

    // let new_arr = [];
    // currentres.map((element, ind) => {
    //   currentsec.map((ele, i) => {
    //     if (element._id.toString() === ele._id.toString()) {
    //       new_arr = new_arr.concat(ele);
    //     }
    //   });
    // });

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
