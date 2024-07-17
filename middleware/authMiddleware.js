const jwt = require("jsonwebtoken");
const User = require("../models/user");

// // Middleware function for JWT authentication and token expiration
async function middlewareAuth(req, res, next) {
  // try {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(400).send({ message: "Token Invalid" });
  }

  const jwttoken = authHeader.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwttoken, "Hs235");

  

    if ((isVerified.role && isVerified.user) || isVerified.userEmail) {
      if(isVerified.role && isVerified.user){
        const exsistinguser = await User.findById(isVerified.user)
        if(!exsistinguser){
          return res.status(400).json({ message: "User is not found" });
        }
      }
      req.user = isVerified;
      return next();
    }

    return res.status(400).json({ message: "User is Unauthorised" });
  } catch (error) {
    return res.status(500).send({ message: `Something went wrong: ${error}` });
  }
  // console.log(first)
  // res.status(200).send({ message: "Success" });

  // } catch (err) {
  //   console.log(`the respose has error: ${err}`);
  // }
}
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

module.exports = { middlewareAuth };
