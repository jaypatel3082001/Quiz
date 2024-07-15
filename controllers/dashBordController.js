const Result = require("../models/Result");
const Questions = require("../models/questions");
const Quiz = require("../models/section");
const Section = require("../models/Quizearr");
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
async function topTenResult(req, res) {
  try {
    const Alldata = await Result.aggregate([
      {
        $lookup: {
          from: "quizzes", // The collection containing Quiz details
          localField: "quizId", // Field from the input documents
          foreignField: "_id", // Field from the 'Quizs' collection
          as: "QuizDetails", // Output array field
        },
      },
      {
        $unwind: "$QuizDetails", // Unwind the QuizDetails array
      },
      {
        $group: {
          _id: "$_id",
          firstname: {
            $first: "$firstname",
          },
          lastname: {
            $first: "$lastname",
          },
          email: {
            $first: "$userEmail",
          },
          result: {
            $first: "$result",
          },
          TotalResult: {
            $first: "$TotalResult",
          },
          QuizName: {
            $first: "$QuizDetails.quizName",
          },
        },
      },
      {
        $sort: {
          result: -1,
        },
      },

      {
        // Limit the result to the last 3 documents
        $limit: 10,
      },
    ]);

    res.status(201).json({ data: Alldata });
  } catch (error) {
    res.status(500).json(`error fetching ${error}`);
  }
}

module.exports = { recentResult, topTenResult };
