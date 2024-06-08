const mongoose = require('mongoose')

const selectSchema = new mongoose.Schema({
    selectedUser:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    selectedSection:{type:mongoose.Schema.Types.ObjectId, ref:'Section'},//quize if require
    result:{
        type:String,
        // required:true

    },
    grade:{
        type:Number,

    }
    // perctage


})
module.exports = mongoose.model('History',selectSchema)