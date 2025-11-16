
import  {asyncHandler} from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';




 
 const generateAccessAndRefreshToken= async(userId)=>{
   
     try{
              
          const user = await User.findById(userId)
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
             user.refreshToken=refreshToken;
             await user.save(validateBeforeSave =false);
          
             return {accessToken,refreshToken};

     }  
     catch(error){
       throw new ApiError(500," Access and Refresh Token generation failed")
     }




 }




const registerUser=asyncHandler(async (req, res) => {
    // Registration logic here
    res.status(200).json({ message: 'OK' });


})


 const loginUser=asyncHandler(async(req,res)=>{
    // Login logic here
    // req body --> data
    // Username or email
    //  fin the user in database
    // password check 
    // access and refresh token generate
    // send cookies


        const {email,username,password}=req.body;

        if(!email || !username){
            throw new ApiError(400,"Email and Username are required")
        }

        const user=  await  User.findOne({
            $or:[{username},{email}]
        })


       if(!user){
        throw new ApiError(404,"User not found")
       }

       
      const isPasswordValid = await user.isPasswordCorrect(password)  // true or false
      
         if(!isPasswordValid){
        throw new ApiError(401,"Invalid password")
       }


         const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);

            // send cookies

             const loggedInUser =   await   User.findById(user._id).select("-password -refreshToken");

             const options={
                httpOnly:true,  
                secure:true
             }


              return  res.status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(
                new ApiResponse(
                    200,
                    {
                        user:loggedInUser,
                        accessToken,
                        refreshToken
                    },
                    "User logged in successfully"
                )
              )

 })
     
   const    logoutUser=  asyncHandler(async(req,res)=>{

       User.findByIdAndUpdate(req.user._id
        ,{
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true,
            
        }
       )

       const options={
        httpOnly:true,  
        secure:true,
       
       }

       return res.status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(
        new ApiResponse(
            200,
            null,
            "User logged out successfully"
        )
       )

   })



export {
    
    registerUser,
    loginUser,
    logoutUser


};