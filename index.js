const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const authRoute = require('./routes/authRoute')
const question = require('./routes/questionRoute')
const quize = require('./routes/quizRoute')
const section = require('./routes/sectionRoute')
const group = require('./routes/groupRoute')
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
// app.use('/section',section)
// app.use('/groups',group)
// app.get('/',)
// app.post('/post',(req,res)=>{
//     const { username, password } = req.body;

//     // Check if the username and password are provided
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }
//    const users=[{
//         "username":"admin1",
//         "password":"123456"
//     }]

//     // Find user in the simulated database
//     const user = users.find(u => u.username === username && u.password === password);

//     // If user not found, return error
//     if (!user) {
//         return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     // If user found, return success message
//     res.status(200).json({ message: 'Login successful!' });
// })
// Parse JSON bodies
// app.use('')
// app.post('/post',(req,res)=>{
//     // console.log(req.body.username)
//     const { username, password } = req.body;
    

//     // Check if the username and password are provided
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }


//     // Find user in the simulated database
//     const user = users.find(u => u.username === username && u.password === password.toString()); // Corrected: Convert password to string for comparison

//     // If user not found, return error
//     if (!user) {
//         return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     // If user found, return success message
//     res.status(200).json({ message: 'Login successful!' });
// })

app.listen(port,()=>{
    console.log("port is working")
})
// module.exports = app; 