const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questions"); // Adjust the path as needed

async function getsearchAll(req, res) {
  try {
    const {
      search,
      limit = 0,
      sortOrder = "asc",
      sortBy = "createdAt", // Default sorting field
      startDate,
      endDate,
    } = req.query;
    const sort = {};

    // Build filter object based on search criteria
    const filter = await buildDocumentFilter(search);

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      buildDateFilter(startDate, endDate, filter);
    }

    // Build sorting criteria
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Fetching documents
    const documents = await QuestionModel.find(filter)
      .sort(sort)
      .limit(parseInt(limit));

    // Return response with data
    return res.status(200).json({
      data: documents,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Function to build document filter
async function buildDocumentFilter(search) {
  const filter = {};
  if (search) {
    filter.question = new RegExp(search, "i"); // Case-insensitive regex search on 'question' field
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
