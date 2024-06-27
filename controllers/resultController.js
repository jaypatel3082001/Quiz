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
      quizewiseResult: result.weightageCountername,
      TotalResult: allData.totalresult,
      quizewiseTotalResult: allData.weightagequizename,
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
  let weightageCountername = [];

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
  questions.forEach((question, i, arr) => {
    let qId = question.quizeId;
    if (question.isAttempted) {
      const correspondingData = allDataMap.get(question.questionId);
      // console.log("question............:", question);
      // console.log(" db -- question............:", correspondingData);
      if (correspondingData && correspondingData.answer === question.answer) {
        sum = sum + correspondingData.weightage;
        // console.log("ffffff", correspondingData.weightage);
        if (weightageCounter[qId]) {
          weightageCounter[qId].weitage += correspondingData.weightage;
        } else {
          // If qId is not in the dictionary, initialize it
          weightageCounter[qId] = {
            quizename: question.quizename,
            weitage: correspondingData.weightage,
          };
          // console.log("inner if...wait", weightageCounter);
        }
      } else {
        if (weightageCounter[qId]) {
          weightageCounter[qId].weitage += 0;
        } else {
          // If qId is not in the dictionary, initialize it
          weightageCounter[qId] = {
            quizename: question.quizename,
            weitage: 0,
          };
        }
      }
    }
    if (weightageCounter[qId]) {
      weightageCountername.push(weightageCounter[qId]);
    }
  });
  weightageCountername = weightageCountername.filter((ele, i, arr) => {
    return arr[i]?.quizename !== arr[i - 1]?.quizename;
  });

  console.log("weightageCounter", weightageCounter);
  // console.log("Final result:", sum);
  return { sum, weightageCountername };
};
const DataFun = async (selectedquestion) => {
  let totalresult = 0;
  let allanswer = [];
  let tempvariable = [];
  let weightageCounter = {};
  let weightagequizename = [];
  // let totalquizeresult;

  // Use for...of to handle asynchronous operations
  for (const ele of selectedquestion.sectioninfo) {
    tf = await Quize.findById(ele).populate("quizemcqs");
    tempvariable.push(tf);
    let qId = ele.quizename;
    //  totalquizeresult = totalquizeResult(tf);
    for (const element of tf.quizemcqs) {
      // totalquizeresult = totalquizeResult(element);
      console.log("results ............", element.weightage);

      totalresult += parseInt(element.weightage);
      if (weightageCounter[qId]) {
        weightageCounter[qId].weitage += element.weightage;
      } else {
        // If qId is not in the dictionary, initialize it
        weightageCounter[qId] = {
          quizename: ele.quizename,
          weitage: element.weightage,
        };
        // console.log("inner if...wait", weightageCounter);
      }

      const obje = {
        questionId: element._id.toString(),
        questionname: element.question,
        questionAns: element.answer,
      };

      allanswer.push(obje);
    }
    weightagequizename.push(weightageCounter[qId]);

    // console.log("tempvariable ............", tempvariable);
  }

  // console.log("results of all data", totalresult);
  return { totalresult, allanswer, tempvariable, weightagequizename };
};

async function getresult(req, res) {
  try {
    const { sectionId } = req.query;
    const { user } = req.user;
    const currentres = await User.findById(user).populate("result");
    const currentSection = await Section.findById(sectionId).populate(
      "sectioninfo"
    );
    console.log("username", currentres.username);
    // console.log("jjdqqqdj", currentres);
    let new_arr = currentres.result;
    let temppvar = [];
    let temppvar2 = [];
    currentSection.sectioninfo.map((ele) => {
      new_arr.filter((element) => {
        if (element.quizewiseResult[ele._id]) {
          temppvar.push({
            quizename: ele.quizename,
            quizeweaitage: element.quizewiseResult[ele._id],
          });
        }
        if (element.quizewiseTotalResult[ele._id]) {
          temppvar2.push({
            quizename: ele.quizename,
            quizeweaitage: element.quizewiseTotalResult[ele._id],
          });
        }
      });
    });

    const quizeWiseRes = temppvar.filter((ele, i, array) => {
      console.log("elll...", array[i].quizename);
      console.log("elll22...", array[i - 1]?.quizename);

      return array[i].quizename !== array[i - 1]?.quizename;
    });
    const quizeWiseTotalRes = temppvar2.filter((ele, i, array) => {
      console.log("elll...", array[i].quizename);
      console.log("elll22...", array[i - 1]?.quizename);

      return array[i].quizename !== array[i - 1]?.quizename;
    });
    // console.log("jwww...hekko", neewaary);

    res
      .status(201)
      .json({ data: { new_arr, quizeWiseRes, quizeWiseTotalRes } });
  } catch (err) {
    res.status(500).json(`error while fetching request ${err}`);
  }
}
async function getalluserresultdata(req, res) {
  try {
    const { user } = req.user;
    const currentres = await User.findById(user).populate("result");

    res.status(201).json({ data: currentres.result });
  } catch (err) {
    res.status(500).json(`error while fetching request ${err}`);
  }
}
async function getallresultdata(req, res) {
  try {
    // const { user } = req.user;
    const results = await Result.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "sections",
          localField: "sectionId",
          foreignField: "_id",
          as: "section",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$section",
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: "$user._id",
            username: "$user.username",
            email: "$user.email",
          },
          section: {
            _id: "$section._id",
            name: "$section.sectionName",
          },
          // questions: 1,
          result: 1,
          quizewiseResult: 1,
          quizewiseTotalResult: 1,
          rightAnswers: 1,
          TotalResult: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    console.log("results", results);

    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json(`error while fetching request ${err}`);
  }
}
async function readSection(req, res) {
  try {
    // const {sectionId}=
    console.log("first", req.params.id);
    const resSec = await Result.findOne({ sectionId: req.params.id }).populate(
      "userId"
    );
    console.log("ffff", resSec);
    res.status(201).json({ data: resSec });
  } catch (error) {
    res.status(500).json(`error ${error}`);
  }
}

module.exports = {
  send,
  getresult,
  getalluserresultdata,
  getallresultdata,
  readSection,
};
