const Section = require("../models/section");
const Quize = require("../models/Quizearr");

async function create(req, res) {
  try {
    const { sectionName, PassingMarks, CountResult, totalTime } = req.body;
    const exsiting = await Section.findOne({ sectionName });
    if (exsiting) {
      return res.status(400).json({ message: "Sectionname already exists" });
    }
    const createsection = await Section.create({
      sectionName,
      PassingMarks,
      CountResult,
      totalTime,
    });
    res.status(201).json({ data: createsection });
  } catch {
    res.status(500).json({ message: "Error while creating" });
  }
}

async function update(req, res) {
  try {
    const { sectionName, PassingMarks, CountResult, totalTime } = req.body;
    const upsection = await Section.findByIdAndUpdate(
      req.params.id,
      { sectionName, PassingMarks, CountResult, totalTime },
      { new: true }
    );
    res.status(201).json({ data: upsection });
  } catch {
    res.status(500).json({ message: "Error while creating" });
  }
}
async function read(req, res) {
  try {
    const secData = await Section.find({}).populate("sectioninfo");
    res.status(201).json({ data: secData });
  } catch {
    res.status(500).json("error reading section");
  }
}
async function deletes(req, res) {
  try {
    const deletesection = await Section.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(201).json("section deleted!");
  } catch {
    res.status(500).json("error while deleting section");
  }
}
async function insertOperation(req, res) {
  try {
    const { quizeId } = req.body;
    // const exsitingquize = await Section.findById(req.params.id)
    // if(exsitingquize){}
    // console.log("fffff",)
    //   const abc=  exsitingquize.sectioninfo.some((ele,i) => ele[i]===quizeId)
    // console.log("fffff",abc)

    const insertQuiz = await Section.findByIdAndUpdate(
      req.params.id,
      {
        $push: { sectioninfo: quizeId },
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
    res.status(500).json("error while inserting section");
  }
}
async function deleteOperation(req, res) {
  try {
    const { quizeId } = req.body;
    const insertQuiz = await Section.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { sectioninfo: quizeId },
      },
      { new: true }
    );
    res.status(201).json("quize deleted");
  } catch {
    res.status(500).json("error while inserting section");
  }
}
async function getallsectionQuize(req, res) {
  try {
    const secData = await Section.findById(req.params.id).populate(
      "sectioninfo"
    );

    // const quiz = await Quize.findById(req.params.id).populate('quizemcqs');

    console.log("pop", secData.sectioninfo);

    // const quiii= await quiz
    if (!secData) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.status(201).json({ data: secData });
    // res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json(`error reading section ${err}`);
  }
}
async function getallsectiondata(req, res) {
  try {
    const secData = await Section.findById(req.params.id);

    if (!secData) {
      return res.status(404).send("Section not found");
    }

    if (!Array.isArray(secData.sectioninfo)) {
      return res.status(400).send("sectioninfo is not an array");
    }

    try {
      const allData = await Promise.all(
        secData.sectioninfo.map(async (ele) => {
          return await Quize.findById(ele).populate("quizemcqs");
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
    res.status(500).json(`error reading section ${err}`);
  }
}
async function insertallOperation(req, res) {
  try {
    const { quizeId, sectionName } = req.body;
    // const {}=req.body
    const exsiting = await Section.findOne({ sectionName });
    if (exsiting) {
      //   return res.status(400).json({ message: "Sectionname already exists" });
      const insertQuiz = await Section.findByIdAndUpdate(
        exsiting._id,
        {
          $push: { sectioninfo: quizeId },
        },
        { new: true }
      );
      console.log("hhjjjh", insertQuiz);
      return res.status(200).json({ data: { insertQuiz } });
    }
    const createsection = await Section.create({ sectionName });
    // res.status(201).json({data: createsection})
    // const exsitingquize = await Section.findById(req.params.id)
    // if(exsitingquize){}
    // console.log("fffff",)
    //   const abc=  exsitingquize.sectioninfo.some((ele,i) => ele[i]===quizeId)
    // console.log("fffff",exsiting)
    // if(quizeId)
    const insertQuiz = await Section.findByIdAndUpdate(
      createsection._id,
      {
        $push: { sectioninfo: quizeId },
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
    res.status(500).json(`error while inserting section ${err}`);
  }
}

module.exports = {
  create,
  update,
  read,
  deletes,
  insertOperation,
  deleteOperation,
  getallsectionQuize,
  getallsectiondata,
  insertallOperation,
};
