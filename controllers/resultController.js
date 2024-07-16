const Result = require("../models/Result");
const Questions = require("../models/questions");
const Quiz = require("../models/section");
const Section = require("../models/Quizearr");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

async function send(req, res) {
  try {
    console.log("req.body", req.body);
    const { quizId, questions, keyid } = req.body; //user=req.params.id
    const { firstname, lastname, userEmail } = req.user;
    // console.log("user id....", user);
    const selectedquestion = await Quiz.findById(quizId).populate("quizinfo");
    // let Totalres;
    // currentuser.result
    // let result=0
    console.log("selectedquestion", selectedquestion);
    if (!Array.isArray(selectedquestion.quizinfo)) {
      return res.status(400).send("sectioninfo is not an array");
    }

    const allData = await DataFun(selectedquestion);
    // console.log("jascript.....", allData[0].quizemcqs);
    console.log("all datfun return", allData);
    const result = countResult(
      allData.tempvariable,
      allData.weightagequizename,
      allData.totalpassing,
      questions
    );

    // let type = selectedquestion.CountResult;

    // const totalquizeresult = totalquizeResult(questions);
    console.log("rrrrrrrrrrrrr", result);
    const allresult = await Result.create({
      firstname: firstname,
      lastname: lastname,
      userEmail: userEmail,
      quizId,
      questions,
      result: result.sum,
      sectionwiseResult: result.weightageCountername,
      TotalResult: allData.totalresult,
      sectionwiseTotalResult: allData.weightagequizename,
      rightAnswers: allData.allanswer,
      TotalPassing: allData.totalpassing,
      status: result.status,
      Key: keyid,
    });
    // const currentuser = await User.findByIdAndUpdate(
    //   user,
    //   {
    //     $push: { result: allresult },
    //   },
    //   { new: true }
    // );
    res.status(201).json({ data: allresult });

    // }

    // res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
}

const countResult = (allData, weightageArr, totalpassing, questions) => {
  let sum = 0;
  let temparry = [];
  let weightageCounter = {};
  let weightageCountername = [];
  let status;

  console.log("Arrayofweightage", weightageArr);
  console.log("PAssing", totalpassing);

  // Flatten all quizemcqs arrays into a single array
  allData.forEach((ele) => {
    if (ele && ele.sectionmcqs) {
      temparry = temparry.concat(ele.sectionmcqs);
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
    let qId = question.sectionId;
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
            sectionname: question.sectionname,
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
            sectionname: question.sectionname,
            weitage: 0,
          };
        }
      }
    } else {
      if (weightageCounter[qId]) {
        weightageCounter[qId].weitage += 0;
      } else {
        // If qId is not in the dictionary, initialize it
        weightageCounter[qId] = {
          sectionname: question.sectionname,
          weitage: 0,
        };
      }
    }
  });
  console.log("weightageCounter", weightageCounter);
  // for (let [key, value] of Object.entries(weightageCounter)) {
  //   for (let i of weightageArr) {
  //     if (value.weightage >= i.Quisewisepassing) {
  //       value.status = "pass";
  //     } else {
  //       value.status = "fail";
  //     }
  //   }
  //   weightageCountername.push(value);
  // }
  for (let [key, value] of Object.entries(weightageCounter)) {
    // Initialize status to 'fail'
    value.status = "fail";

    // Check if the value's weightage meets or exceeds any of the passing criteria
    for (let i of weightageArr) {
      if (value.weitage >= i.sectionwisePassing) {
        value.status = "pass";
        break; // If it passes one criteria, no need to check further
      } else if (i.weitage < i.sectionwisePassing) {
        value.status = "Invalid";
        break;
      }
    }

    // Push the updated value into weightageCountername
    weightageCountername.push(value);
  }
  console.log("weightageCounter", weightageCounter);
  // console.log("Final result:", sum);

  if (sum >= totalpassing) {
    status = "pass";
  } else {
    status = "fail";
  }
  return { sum, weightageCountername, status };
};
const DataFun = async (selectedquestion) => {
  let totalresult = 0;
  let allanswer = [];
  let tempvariable = [];
  let weightageCounter = {};
  let weightagequizename = [];
  let status;

  let totalpassing = selectedquestion.PassingMarks;
  // let Quisewisepassing = [];
  // Use for...of to handle asynchronous operations
  console.log("first", selectedquestion);
  for (const ele of selectedquestion.quizinfo) {
    tf = await Section.findById(ele).populate("sectionmcqs");
    tempvariable.push(tf);
    let qId = ele.sectionname;
    // Quisewisepassing.push(ele.Quisewisepassing);
    //  totalquizeresult = totalquizeResult(tf);
    for (const element of tf.sectionmcqs) {
      // totalquizeresult = totalquizeResult(element);
      console.log("results ............", element.weightage);

      totalresult += parseInt(element.weightage);
      if (weightageCounter[qId]) {
        weightageCounter[qId].weitage += element.weightage;
      } else {
        // If qId is not in the dictionary, initialize it
        weightageCounter[qId] = {
          sectionname: ele.sectionname,
          weitage: element.weightage,
          sectionwisePassing: ele.sectionpassingMarks,
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
  return {
    totalresult,
    allanswer,
    tempvariable,
    weightagequizename,
    totalpassing,
  };
};

async function getresult(req, res) {
  try {
    const { quizId } = req.query;
    const { firstname, lastname, userEmail } = req.user;
    const currentres = await Result.find({ firstname, lastname, userEmail });
    const currentSection = await Quiz.findById(quizId).populate("sectioninfo");
    // console.log("username", currentres.username);
    // console.log("jjdqqqdj", currentres);
    let new_arr = currentres;
    let temppvar = [];
    let temppvar2 = [];
    currentSection.quizinfo.map((ele) => {
      new_arr.filter((element) => {
        if (element.sectionwiseResult[ele._id]) {
          temppvar.push({
            sectionname: ele.sectionname,
            sectionweaitage: element.sectionwiseResult[ele._id],
          });
        }
        if (element.sectionwiseTotalResult[ele._id]) {
          temppvar2.push({
            sectionname: ele.sectionname,
            sectionweaitage: element.sectionwiseTotalResult[ele._id],
          });
        }
      });
    });

    const quizeWiseRes = temppvar.filter((ele, i, array) => {
      console.log("elll...", array[i].sectionname);
      console.log("elll22...", array[i - 1]?.sectionname);

      return array[i].sectionname !== array[i - 1]?.sectionname;
    });
    const quizeWiseTotalRes = temppvar2.filter((ele, i, array) => {
      console.log("elll...", array[i].sectionname);
      console.log("elll22...", array[i - 1]?.sectionname);

      return array[i].sectionname !== array[i - 1]?.sectionname;
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
    const { user } = req.user;
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
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quiz",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$quiz",
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
            _id: "$quiz._id",
            name: "$quiz.quizName",
          },
          // questions: 1,
          result: 1,
          sectionwiseResult: 1,
          sectionwiseTotalResult: 1,
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
    const resSec = await Result.findOne({ quizId: req.params.id }).populate(
      "userId"
    );
    console.log("ffff", resSec);
    res.status(201).json({ data: resSec });
  } catch (error) {
    res.status(500).json(`error ${error}`);
  }
}
async function readOneresult(req, res) {
  try {
    // const {sectionId}=
    // console.log("first", req.params.id);
    const resSec = await Result.aggregate([
      {
        $match: {
          _id: new ObjectId(`${req.params.id}`),
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quizDetails",
        },
      },

      {
        $unwind: "$sectionwiseResult",
      },
      {
        $unwind: "$quizDetails",
      },
      {
        $group: {
          _id: "$_id",
          username: {
            $first: { $concat: ["$firstname", " ", "$lastname"] },
          },
          email: {
            $first: "$userEmail",
          },
          date: {
            $first: "$createdAt",
          },
          QuizName: {
            $first: "$quizDetails.quizName",
          },
          TotalMarks: {
            $first: "$TotalResult",
          },
          TotalPassing: {
            $first: "$TotalPassing",
          },
          result: {
            $first: "$result",
          },
          sectionwiseResult: { $push: "$sectionwiseResult" },
          sectionwiseTotalResult: { $first: "$sectionwiseTotalResult" },
          status: { $first: "$status" },
        },
      },
      {
        $addFields: {
          sectionWiseStatus: {
            $cond: {
              if: {
                $in: ["fail", "$sectionwiseResult.status"],
              },
              then: "fail",
              else: "pass",
            },
          },
        },
      },
      {
        $addFields: {
          finalStatus: {
            $cond: {
              if: { $eq: ["$sectionwiseResult", "fail"] },
              then: "fail",
              else: "$status",
            },
          },
        },
      },
    ]);
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
  readOneresult,
};
