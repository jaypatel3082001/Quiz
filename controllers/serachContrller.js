const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questions");
const QuizeModel = require("../models/Quizearr");
const Sectionmodel = require("../models/section");
const Resultmodel = require("../models/Result");
const User = require("../models/user");

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
                {
                  case: { $eq: [type, "result"] },
                  then: { $toString: "$userId" },
                },
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
    if (Model === Resultmodel) {
      documents = await Model.aggregate(pipeline).exec();

      // Manually populate the userId field after aggregation
      documents = await Resultmodel.populate(documents, {
        path: "userId",
        select: "username email",
      });
    } else {
      documents = await Model.aggregate(pipeline).exec();
    }

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
      filter.userId = await getUserIdByUsername(search);
    }
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

module.exports = {
  getsearchAll,
};