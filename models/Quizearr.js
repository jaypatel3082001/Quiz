// const mongoose = require('mongoose')

// const QuizeSchema = new mongoose.Schema({
//     quizemcx:[]

// })
const mongoose = require('mongoose');

const quizeSchema = new mongoose.Schema({
    quizemcqs: [{type:mongoose.Schema.Types.ObjectId, ref:'Questions'}],
    // id:{
    //     type:Number
    // },
    quizename: {
        type: String,
        required: true,
    }


});
module.exports = mongoose.model('Quize', quizeSchema);