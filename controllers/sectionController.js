const Quiz = require("../models/section");
// const Quize = require("../models/Quizearr");
const Section = require("../models/Quizearr");

async function create(req, res) {
  try {
    const { quizName, PassingMarks, CountResult, totalTime } = req.body;
    const exsiting = await Quiz.findOne({ quizName });
    if (exsiting) {
      return res.status(400).json({ message: "quizname already exists" });
    }
    // let uniqquizid;
    // let isUnique = false;

    // while (!isUnique) {
    //   uniqquizid = parseInt(RandomGenerator());
    //   const existingNum = await Section.findOne({ uniqsecid });
    //   if (!existingNum) {
    //     isUnique = true;
    //   }
    // }
    const createquiz = await Quiz.create({
      quizName,
      PassingMarks,
      CountResult,
      totalTime,
      // uniqquizid
    });
    res.status(201).json({ data: createquiz });
  } catch {
    res.status(500).json({ message: "Error while creating" });
  }
}

async function update(req, res) {
  try {
    const { quizName, PassingMarks, CountResult, totalTime } = req.body;
    const upquiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { quizName, PassingMarks, CountResult, totalTime },
      { new: true }
    );
    res.status(201).json({ data: upquiz });
  } catch {
    res.status(500).json({ message: "Error while creating" });
  }
}
async function read(req, res) {
  try {
    const secData = await Quiz.find({}).populate("quizinfo");
    res.status(201).json({ data: secData });
  } catch {
    res.status(500).json("error reading quiz");
  }
}
async function deletes(req, res) {
  try {
    const deletequiz = await Quiz.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(201).json("quiz deleted!");
  } catch {
    res.status(500).json("error while deleting quiz");
  }
}
async function insertOperation(req, res) {
  try {
    const { sectionId } = req.body;
    // const exsitingquize = await Section.findById(req.params.id)
    // if(exsitingquize){}
    // console.log("fffff",)
    //   const abc=  exsitingquize.sectioninfo.some((ele,i) => ele[i]===quizeId)
    // console.log("fffff",abc)

    const insertQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        $push: { quizinfo: sectionId },
      },
      { new: true }
    );
    console.log("hhh", insertQuiz);
    res.status(201).json({ data: insertQuiz });

    // const { questionId } = req.body;
    // const quizarr = await Quize.findByIdAndUpdate(req.params.id, {
    //     $push: { quizemcqs: questionId }
    // }, { new: true });
    // res.status(200).json({ data: quizarr });
  } catch {
    res.status(500).json("error while inserting quiz");
  }
}
async function deleteOperation(req, res) {
  try {
    const { sectionId } = req.body;
    const insertQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { quizinfo: sectionId },
      },
      { new: true }
    );
    res.status(201).json("quize deleted");
  } catch {
    res.status(500).json("error while inserting quiz");
  }
}
async function getallquizQuize(req, res) {
  try {
    const secData = await Quiz.findById(req.params.id).populate("quizinfo");

    // const quiz = await Quize.findById(req.params.id).populate('quizemcqs');

    console.log("pop", secData.quizinfo);

    // const quiii= await quiz
    if (!secData) {
      return res.status(404).json({ error: "quiz not found" });
    }
    res.status(201).json({ data: secData });
    // res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json(`error reading quiz ${err}`);
  }
}
async function getallquizdata(req, res) {
  try {
    const secData = await Quiz.findById(req.params.id);

    if (!secData) {
      return res.status(404).send("quiz not found");
    }

    if (!Array.isArray(secData.quizinfo)) {
      return res.status(400).send("quizinfo is not an array");
    }

    try {
      const allData = await Promise.all(
        secData.quizinfo.map(async (ele) => {
          return await Section.findById(ele).populate("sectionmcqs");
        })
      );

      console.log(allData);

      // You can send the populated data as a response if needed
      res.json({ allData, totalTime: secData.totalTime });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }

    // res.status(200).json(quiz);
  } catch (err) {
    console.log(err);
    res.status(500).json(`error reading quiz ${err}`);
  }
}
async function insertallOperation(req, res) {
  try {
    const { sectionId, quizName } = req.body;
    // const {}=req.body
    const exsiting = await Quiz.findOne({ quizName });
    if (exsiting) {
      //   return res.status(400).json({ message: "Sectionname already exists" });
      const insertQuiz = await Quiz.findByIdAndUpdate(
        exsiting._id,
        {
          $push: { quizinfo: sectionId },
        },
        { new: true }
      );
      console.log("hhjjjh", insertQuiz);
      return res.status(200).json({ data: { insertQuiz } });
    }
    const createquiz = await Quiz.create({ quizName });
    // res.status(201).json({data: createsection})
    // const exsitingquize = await Section.findById(req.params.id)
    // if(exsitingquize){}
    // console.log("fffff",)
    //   const abc=  exsitingquize.sectioninfo.some((ele,i) => ele[i]===sectionId)
    // console.log("fffff",exsiting)
    // if(sectionId)
    const insertQuiz = await Quiz.findByIdAndUpdate(
      createquiz._id,
      {
        $push: { quizinfo: sectionId },
      },
      { new: true }
    );
    console.log("hhh", insertQuiz);
    return res.status(201).json({ data: { insertQuiz } });

    // const { questionId } = req.body;
    // const quizarr = await Quize.findByIdAndUpdate(req.params.id, {
    //     $push: { quizemcqs: questionId }
    // }, { new: true });
    // res.status(200).json({ data: quizarr });
  } catch (err) {
    res.status(500).json(`error while inserting quiz ${err}`);
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
  create,
  update,
  read,
  deletes,
  insertOperation,
  deleteOperation,
  getallquizQuize,
  getallquizdata,
  insertallOperation,
};
