
//require("dotenv").config(path="../.env");

import dotenv from "dotenv";
import connectDB from "./db/db.js";


// professional approach high use this 

dotenv.config({
    path:'./.env'
});



connectDB();





 



/*         Approch 1

import express from "express";
const app=express();


 ;(async ()=>{
    try{
 
         await  mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
            console.log("DB connected");
            app.on("error",(error)=>{
                console.log("Error in DB connection",error)
                   throw error
                    
                })

  
                 app.listen(process.env.PORT,()=>{
                    console.log(`App is Listening on port ${process.env.PORT}`);
                 })



    }catch(error){
        console.log("Error in DB connection",error)

    }
 })()
    */



