const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questions");
const QuizeModel = require("../models/Quizearr");
const Sectionmodel = require("../models/section");

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
        : Sectionmodel;

    console.log("moodel", Model);

    const totalCount = await Model.countDocuments(filter);

    const customSort = (a, b) => {
      const aVal = getSortValue(a, type);
      const bVal = getSortValue(b, type);
      const order = customOrder.split("");
      const aIndex = order.indexOf(aVal[0]);
      const bIndex = order.indexOf(bVal[0]);

      if (aIndex === -1 || bIndex === -1) return 0; // If character not found in custom order
      return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
    };

    // Fetching documents without sorting (sorting will be done in application)
    console.log("ffi", filter);
    console.log("count", totalCount);
    let documents = await Model.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Custom sort function

    // Perform custom sort
    // documents;
    documents.sort(customSort);
    documents;
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
    }
  }

  return filter;
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

function getSortValue(obj, type) {
  if (type === "question") {
    return obj.question;
  } else if (type === "quiz") {
    return obj.quizename;
  } else if (type === "section") {
    return obj.sectionName;
  }
  return "";
}

// Helper function to get sort value from object based on type

module.exports = {
  getsearchAll,
};
