// const checkRole = (allowedRoles) => {
//     return (req, res, next) => {
//       if (!Array.isArray(req.user?.roles)) {
//         return res.status(404).json("Invalid")
//       }
  
//       const isAuthorized = req.user?.roles.some((role) =>
//         allowedRoles.includes(role)
//       );
  
//       if (!isAuthorized) {
//         return res.status(400).json("Access denied")
//       }
  
//       next();
//     };
//   };
  
//   module.exports = {checkRole}