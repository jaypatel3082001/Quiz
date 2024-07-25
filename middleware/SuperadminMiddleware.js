const jwt = require("jsonwebtoken");
const User = require("../models/user");

// // Middleware function for JWT authentication and token expiration
async function middlewareAuthforSuperAdmin(req, res, next) {
  // try {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(400).send({ message: "Token Invalid" });
  }

  const jwttoken = authHeader.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwttoken, "Hs235");

  

  if(isVerified.role==="SuperAdmin"){
      req.user = isVerified;
      return next();
    }else{

        return res.status(400).json({ message: "User is Unauthorised" });
    }

  } catch (error) {
    return res.status(500).send({ message: `Something went wrong: ${error}` });
  }
}

 

module.exports = { middlewareAuthforSuperAdmin };
