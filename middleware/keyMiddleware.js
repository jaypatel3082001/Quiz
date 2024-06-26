const Key = require('../models/randomkey')

async function KeyAuth(req,res,next){
try{
    const existKey=await Key.find({})
    req.key=existKey
    next()

}catch(error){
    res.status(401).json("Key is Invalid")
}
}

module.exports={KeyAuth}