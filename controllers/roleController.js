const Role=require('../models/role')
const Permission=require('../models/permissions')
const User=require('../models/user')

async function createRole(req,res){
    try{
        // const {rolename,permissions}=req.body

    }catch(err){
        res.status(500).json(`error while creating role ${err}`)
    }
}




module.exports={}