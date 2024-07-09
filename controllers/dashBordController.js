const Result = require("../models/Result");
const Questions = require("../models/questions");
const Section = require("../models/section");
const Quize = require("../models/Quizearr");
const User = require("../models/user");

async function recentResult(req,res){
try{
    const Alldata= await Result.aggregate([
       
    ])

res.status(201).json({data:Alldata})
}catch(error){
    res.status(500).json(`error fetching ${error}`)
}
}





module.exports={recentResult}