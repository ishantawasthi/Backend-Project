
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"



export const verifyJWT= asyncHandler (async(req,_,next)=>{

 try{
       const token =  req.cookies?.accessToken ||  req.headers?.("authorization")?.replace("Bearer ","")
    if(!token){
        throw new ApiError(401,"Unauthorized access , no token found")
    }

      const decodeToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

       const user=  await User.findById(decodeToken?._id).select("-password -refreshToken")

       if(!user){
        // TODO : discuss about frontend 
        throw new ApiError(401,"Unauthorized access , user not found")
       }

       req.user=user;
       next();
 }
    catch(error){
        throw new ApiError(401,"Unauthorized access , invalid  access token")   
    }
})