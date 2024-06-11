// const jwt = require('jsonwebtoken');

// // Middleware function for JWT authentication and token expiration
// function authenticateToken(req, res, next) {


//   try{
//      const token = req.headers['authorization'];
//     res.status(200).send({ message: 'Success' });
//     next();

//   }catch(err){
//     console.log(`the respose has error: ${err}`)
//   }
//     // Get token from headers, query parameters, or cookies
//     // const token = req.headers['authorization'];
//     // console.log("tokkk",req.headers)

//     // if (!token) {
//     //     return res.status(403).send({ auth: false, message: 'No token provided.' });
//     // }

//     // // Verify the token
//     // jwt.verify(token, 'your_secret_key', function(err, decoded) {
//     //     if (err) {
//     //         return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
//     //     }

//     //     // Check token expiration
//     //     if (Date.now() >= decoded.exp * 1000) {
//     //         return res.status(401).send({ auth: false, message: 'Token expired.' });
//     //     }

//     //     // If token is valid and not expired, save decoded token to request object
//     //     req.userId = decoded.id;
   
//     // });
// }

// module.exports = {authenticateToken}
