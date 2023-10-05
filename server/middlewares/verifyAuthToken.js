
import jwt from "jsonwebtoken";

import User from "../models/User.js";


const userauthToken = async (req,res,next) =>{
   const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication== failed");
  }

  const token = authHeader?.split(" ")[1];
     try {
        
     const decodeToken  = jwt.verify(token,process.env.JWT_SECRET)
     req.body.user = {
         userId : decodeToken.userId
     } 
     next()
        
     } catch (error) {
        next("Oops error in authentication")
     }
}

// const userauthToken = async (req,res,next) =>{
//    let token
//   const { authorization } = req.headers

//   if (authorization && authorization.startsWith('Bearer')) {
//    try {
//       token = authorization.split(' ')[1]
        
//       const decodeToken  = jwt.verify(token,process.env.JWT_SECRET)
//       req.body.user = {
//           userId : decodeToken.userId
//       } 
//       next()
         
//       } catch (error) {
//          next("Oops error in authentication")
//       }
//   }
//   if (!token) {
//    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
//  }
    
// }

export default userauthToken;