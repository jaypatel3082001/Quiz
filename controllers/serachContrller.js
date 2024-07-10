const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questions");
const QuizeModel = require("../models/Quizearr");
const Sectionmodel = require("../models/section");
const Resultmodel = require("../models/Result");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

async function getsearchAll(req, res) {
  try {
    const {
      search,
      limit = 0,
      offset = 0,
      sortOrder = "asc",
      startDate,
      endDate,
      type,
      customOrder = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    } = req.query;

    // Build filter object based on search criteria
    const filter = await buildDocumentFilter(search, type);

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      buildDateFilter(startDate, endDate, filter);
    }

    const Model =
      type === "question"
        ? QuestionModel
        : type === "quiz"
        ? QuizeModel
        : type === "section"
        ? Sectionmodel
        : Resultmodel;

    console.log("model", Model);

    // Count the total documents matching the filter
    const totalCount = await Model.countDocuments(filter);

    // Build the aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          sortField: {
            $switch: {
              branches: [
                { case: { $eq: [type, "question"] }, then: "$question" },
                { case: { $eq: [type, "quiz"] }, then: "$quizename" },
                { case: { $eq: [type, "section"] }, then: "$sectionName" },
              ],
              default: "",
            },
          },
        },
      },
      {
        $addFields: {
          sortIndex: {
            $indexOfArray: [
              customOrder.split(""),
              { $substr: ["$sortField", 0, 1] },
            ],
          },
        },
      },
      { $sort: { sortIndex: sortOrder === "asc" ? 1 : -1 } },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) },
    ];

    let documents;

    documents = await Model.aggregate(pipeline);

    // Manually populate the userId field after aggregation

    // Return response with data
    return res.status(200).json({
      data: documents,
      totalCount,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Function to build document filter
async function buildDocumentFilter(search, type) {
  const filter = {};
  if (search) {
    if (type === "question") {
      filter.question = new RegExp(search, "i");
    } else if (type === "quiz") {
      filter.quizename = new RegExp(search, "i");
    } else if (type === "section") {
      filter.sectionName = new RegExp(search, "i");
    } else if (type === "result") {
      // Using populate means we need to search by userId field
      // filter.userId.username = new RegExp(search, "i");
      console.log("i am herw");
      filter.userId = await getUserIdByUsername(search);
    }
    console.log("w ghgherw");
  }

  return filter;
}

// Helper function to get user ID by username
async function getUserIdByUsername(username) {
  const user = await User.findOne({ username: new RegExp(username, "i") })
    .select("_id")
    .exec();
  return user ? user._id : null;
}

// Helper function to build date filter
function buildDateFilter(startDate, endDate, filter) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure dates are valid
  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
    // Dates are valid, add to filter
    filter.createdAt = { $gte: start, $lte: end };
  }
}

async function getsearchSection(req, res) {
  try {
    const customOrder =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const search = req.query.search;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const type = req.query.type;
    const status = req.query.status;
    const mainstatus = req.query.mainstatus;
    const limit = parseInt(req.query.limit) || 0;
    const offset = parseInt(req.query.offset) || 0;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    console.log(" req.params.id", req.params.id);
    console.log(" startDate", startDate);
    console.log(" endDate", endDate);
    console.log(" type", type);

    const filter = await buildDocumentFilter(search, type);
    console.log(" type  filter", filter);

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      buildDateFilter(startDate, endDate, filter);
      console.log(" type ,,,,,,,,,, filter", filter);
    }

    // const Model =
    //   type === "question"
    //     ? QuestionModel
    //     : type === "quiz"
    //     ? QuizeModel
    //     : type === "section"
    //     ? Sectionmodel
    //     : Resultmodel;

    // console.log("model", Model);

    // Count the total documents matching the filter
    const getCustomOrderIndex = (char) => customOrder.indexOf(char);

    // // Build the aggregation pipeline
    // const pipeline = [
    //   {
    //     $group: {
    //       sectionId: req.params.id,
    //     },
    //   },
    // ];

    // // Execute the aggregation pipeline
    // const documents = await Resultmodel.aggregate(pipeline).exec();
    // const documents = await Resultmodel.find({
    //   sectionId: req.params.id,
    //   ...filter,
    // })
    //   .limit(limit)
    //   .skip(offset);

    const documents = await Resultmodel.aggregate([
      {
        $match: {
          sectionId: new ObjectId(req.params.id),
          ...filter,
        },
      },
      {
        $match: {
          $or: [
            { firstname: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { userEmail: { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $unwind: "$quizewiseResult",
      },
      {
        $match: {
          ...(status && { "quizewiseResult.status": status }),
        },
      },
      {
        $group: {
          _id: "$_id",
          sectionId: { $first: "$sectionId" },
          firstname: { $first: "$firstname" },
          lastname: { $first: "$lastname" },
          userEmail: { $first: "$userEmail" },
          quizewiseResult: { $push: "$quizewiseResult" },
          quizewiseTotalResult: { $first: "$quizewiseTotalResult" },
          TotalPassing: { $first: "$TotalPassing" },
          createdAt: { $first: "$createdAt" },
          result: { $first: "$result" },
          status: { $first: "$status" },
        },
      },
      {
        $addFields: {
          quizeWiseStatus: {
            $cond: {
              if: {
                $in: ["fail", "$quizewiseResult.status"],
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
              if: { $eq: ["$quizeWiseStatus", "fail"] },
              then: "fail",
              else: "$status",
            },
          },
        },
      },
      {
        $sort: {
          createdAt: sortOrder,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]).exec();

    // Count the total documents matching the filter (without limit and offset)
    const totalCount = await Resultmodel.countDocuments({
      sectionId: req.params.id,
      ...filter,
    });

    return res.status(200).json({
      data: documents,
      totalCount,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getsearchAll,
  getsearchSection,
};
