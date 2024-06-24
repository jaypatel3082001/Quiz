const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questions"); // Adjust the path as needed
const QuizeModel = require("../models/Quizearr"); // Adjust the path as needed

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

    const Model = type === "question" ? QuestionModel : QuizeModel;

    const totalCount = await Model.countDocuments(filter);

    // Fetching documents without sorting (sorting will be done in application)
    let documents = await Model.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Custom sort function
    const customSort = (a, b) => {
      const aVal = getSortValue(a, type);
      const bVal = getSortValue(b, type);
      const order = customOrder.split("");
      const aIndex = order.indexOf(aVal[0]);
      const bIndex = order.indexOf(bVal[0]);

      if (aIndex === -1 || bIndex === -1) return 0; // If character not found in custom order
      return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
    };

    // Perform custom sort
    documents.sort(customSort);

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

// Helper function to get sort value from object based on type
function getSortValue(obj, type) {
  if (type === "question") {
    return obj.question;
  } else if (type === "quiz") {
    return obj.quizename;
  }
  return "";
}

module.exports = {
  getsearchAll,
};
