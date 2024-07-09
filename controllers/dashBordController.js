const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");
const Quize = require("../models/Quizearr");
const User = require("../models/user");

async function recentResult(req, res) {
  try {
    const Alldata = await Result.aggregate([
      {
        // Sort the documents by the desired date field in descending order
        $sort: {
          createdAt: -1, // Replace 'dateField' with the actual field name that stores the date
        },
      },
      {
        // Limit the result to the last 3 documents
        $limit: 3,
      },
    ]);

    res.status(201).json({ data: Alldata });
  } catch (error) {
    res.status(500).json(`error fetching ${error}`);
  }
}

module.exports = { recentResult };
