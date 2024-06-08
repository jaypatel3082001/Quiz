const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const authRoute = require('./routes/authRoute')
const question = require('./routes/questionRoute')
const quize = require('./routes/quizRoute')
const section = require('./routes/sectionRoute')
const history = require('./routes/historyRoute')
// const mongoose = require('mongoose')
const app = express()
env.config()
// const user = require('./models/user')
const bodyParser = require('body-parser');

const port = process.env.PORT || 3001
// const mongo = mongoose()

mongoose.connect("mongodb+srv://jayp_3008:jay123@cluster0.xycjrla.mongodb.net/Quizz_soft?retryWrites=true&w=majority",

)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(bodyParser.json()); 
app.use('/auth',authRoute)
app.use('/questions',question)
app.use('/quize',quize)
app.use('/section',section)
app.use('/history',history)

app.listen(port,()=>{
    console.log("port is working")
})
// module.exports = app; 