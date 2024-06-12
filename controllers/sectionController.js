const Section = require('../models/section')

async function create (req,res){
try{
    const {sectionName}=req.body
    const exsiting = await Section.findOne({sectionName})
    if(exsiting){
    return res.status(400).json({ message: 'Sectionname already exists' });
    }
    const createsection = await Section.create({sectionName})
    res.status(201).json({data: createsection})

}catch{
res.status(500).json({message:"Error while creating"})
}
}


async function update (req,res){
try{
    const {sectionName}=req.body
    const upsection = await Section.findByIdAndUpdate(req.params.id,{sectionName}, { new: true })
    res.status(201).json({data: upsection})

}catch{
    res.status(500).json({message:"Error while creating"})
}
}
async function read (req,res){
    try{
        const secData = await Section.find({}).populate('sectioninfo')
        res.status(201).json({data: secData})

    }catch{
        res.status(500).json("error reading section")
        
    }

}
async function deletes (req,res){
    try{
        const deletesection = await Section.findByIdAndDelete({_id: req.params.id})
        res.status(201).json("section deleted!")

    }catch{
        res.status(500).json("error while deleting section")
    }

}
async function insertOperation (req,res){
    try{
        const {quizeId} = req.body
        const insertQuiz = await Section.findByIdAndUpdate(req.params.id,{
            $push: { sectioninfo: quizeId }
        },{new:true})
        res.status(201).json({data: insertQuiz})

    }catch{
        res.status(500).json("error while inserting section")
        
    }

}
async function deleteOperation (req,res){
    try{
        const {quizeId} = req.body
        const insertQuiz = await Section.findByIdAndUpdate(req.params.id,{
            $pull: { sectioninfo: quizeId }
        },{new:true})
        res.status(201).json("quize deleted")

    }catch{
        res.status(500).json("error while inserting section")
        
    }

}
async function getallsectionQuize (req,res){
    try{

        const secData = await Section.findById(req.params.id).populate('sectioninfo')
       
        // const quiz = await Quize.findById(req.params.id).populate('quizemcqs');
      
        console.log("pop",secData);

        // const quiii= await quiz
        if (!secData) {
            return res.status(404).json({ error: 'Section not found' });
          }
          res.status(201).json({data: secData})
        // res.status(200).json(quiz);

    }catch(err){
        res.status(500).json(`error reading section ${err}`)
        
    }

}

module.exports={create,update,read,deletes,insertOperation,deleteOperation,getallsectionQuize}