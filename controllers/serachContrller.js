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
      sortBy = "createdAt", // Default sorting field
      startDate,
      endDate,
      type,
    } = req.query;
    const sort = {};

    // Build filter object based on search criteria
    const filter = await buildDocumentFilter(search, type);

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      buildDateFilter(startDate, endDate, filter);
    }

    // Build sorting criteria
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const Model = type === "question" ? QuestionModel : QuizeModel;

    const totalCount = await Model.countDocuments(filter);

    // Fetching documents with pagination
    const documents = await Model.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

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

module.exports = {
  getsearchAll,
};
