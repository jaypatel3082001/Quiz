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
      datePicker,
    } = req.query;
    const sort = {};

    // Build filter object based on search criteria
    const filter = await buildDocumentFilter(search);

    // console.log("date1", typeof startDate);
    // console.log("date1", endDate);
    // const daterang = startDate - endDate;
    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      // Parse start and end dates into Date objects
      //   const start = parseDateString(startDate);
      //   const end = parseDateString(endDate);

      // Validate if start and end dates are valid Date objects
      //   if (!isValidDate(start) || !isValidDate(end)) {
      //     throw new Error("Invalid start or end date");
      //   }

      // Apply date range filter
      //   filter.createdAt = { $gte: startDate, $lte: endDate };
      buildDateFilter(datePicker, filter);
    }

    // Build sorting criteria
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Fetching documents
    console.log("filter..new", filter);
    const documents = await QuestionModel.find(filter)
      .sort(sort)
      .limit(parseInt(limit));
    //   .populate({
    //     path: "auditLogs",
    //     model: "auditLogs",
    //     select: "description",
    //   })
    //   .sort(sort)
    //   .limit(parseInt(limit));
    //   console.log("filter..",filter)
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

// Helper function to parse date string into Date object
function parseDateString(dateString) {
  const [day, month, year] = dateString.split("-").map(Number);
  // Note: Months are 0-indexed in JavaScript Date, so subtract 1 from month
  return new Date(year, month - 1, day);
}

// Helper function to validate Date object
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
function buildDateFilter(dateRange, filter) {
  const dateRangeParts = dateRange.split(" - ");
  if (dateRangeParts.length === 2) {
    const startDateParts = dateRangeParts[0].split("/");
    const endDateParts = dateRangeParts[1].split("/");

    // Construct dates in the format: MM/DD/YYYY
    const startDate = new Date(
      startDateParts[2],
      parseInt(startDateParts[1]) - 1, // Month is 0-indexed
      startDateParts[0]
    );
    const endDate = new Date(
      endDateParts[2],
      parseInt(endDateParts[1]) - 1, // Month is 0-indexed
      endDateParts[0]
    );

    // Ensure dates are valid
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      // Dates are valid, add to filter
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
}

module.exports = {
  getsearchAll,
};
