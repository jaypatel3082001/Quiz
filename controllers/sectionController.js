const Section = require('../models/section')

async function create (req,res){
try{
    const {sectionName}=req.body
    const createsection = await Section.create({sectionName})
    res.status(201).JSON({data: createsection})

}catch{
res.status(500).JSON({message:"Error while creating"})
}
}
async function update (req,res){
try{

}catch{
    
}
}
async function read (req,res){
    try{

    }catch{
        
    }

}
async function deletes (req,res){
    try{

    }catch{
        
    }

}
async function insertOperation (req,res){
    try{

    }catch{
        
    }

}

module.exports={create,update,read,deletes,insertOperation}