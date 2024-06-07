
const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true
    },
    sectioninfo:[{type:mongoose.Schema.Types.ObjectId, ref:'Quize'}],

})


module.exports = mongoose.model('Section', sectionSchema);