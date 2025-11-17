
import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'
import dotenv from "dotenv";

dotenv.config();  // <-- IMPORTANT

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


 const uploadOnCloudinary= async (localfilePath)=>{

     try{
           if(!localfilePath) return null

             // upload  file on cloudinary

           const response = await  cloudinary.uploader.upload(localfilePath,{
                resource_type:'auto',
             })
                  //  file has been uploaded succesfully
                  
                  console.log("File uploaded on cloudinary successfully",response.url);
                  fs.unlinkSync(localfilePath); // remove the locally saved file
                  return response ;

     }  catch(error){

     console.log("Cloudinary upload error:",error.message);

   // Remove locally saved file
        if (fs.existsSync(localfilePath)) {
            fs.unlinkSync(localfilePath);
        }

        return null;
     }

 }
 export { uploadOnCloudinary }
   



