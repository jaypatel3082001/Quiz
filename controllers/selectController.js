const History = require('../models/select')
const Section = require('../models/section')
const Quize = require('../models/Quizearr');
const User = require('../models/user');


// async function create (req,res){
//     try{
//         const {section}=req.body
//         const newsec = await S

//     }catch{
//         res.status(500).json("Error In inserting")
//     }

// }
async function create (req,res){
    try{
        const { section }=req.body//user=req.params.id
        const selectedSection= await Section.findOne({sectionName:section})
        // const existingUser = await Section.findOne({ section });
        const user= await User.findById(req.params.id)
        if (!selectedSection) {
            return res.status(404).json("not found section")

        }

          
        // console.log("ggg",section)
        // console.log("ggghhhh",user._id.toString())
        const crethistory = await History.create({selectedUser: user._id,selectedSection:selectedSection})

          res.status(201).json({ message: crethistory });
       
        // }
    
        
        // res.status(404).json({ message: 'Not found' });
  

        

    }catch(error){
        console.log(error)
        res.status(500).json({err: error})
    }

}

module.exports = {
    create
}