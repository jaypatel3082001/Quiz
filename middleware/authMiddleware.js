const jwt = require("jsonwebtoken");

// // Middleware function for JWT authentication and token expiration
async function middlewareAuth(req, res, next) {
  // try {
  const authHeader = req.header("Authorization");
  console.log("tokkk", authHeader);
  if (!authHeader) {
    res.status(400).send({ message: "toke Invalid" });
  }
  const jwttoken = authHeader.replace("Bearer", "").trim();
  console.log("llll", jwttoken);
  try {
    const isVarified = jwt.verify(jwttoken, "Hs235");
    console.log("awwdddd", isVarified);
    req.user = isVarified;
    next();
  } catch (error) {
    res
      .status(500)
      .send({ message: `somthing wrong here is your  error ${error}` });
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
