
const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupName:{
        type:String,
        required:true
    },
    groupinfo:[{type:mongoose.Schema.Types.ObjectId, ref:'Section'}],

})


module.exports = mongoose.model('Group', groupSchema);