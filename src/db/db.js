import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{

try{

  const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`\n DB connected !! DB HOST : ${connectionInstance.connection.host} `);

  return connectionInstance;

}
catch(error){
    console.log("Error in DB connection",error) ;
    throw error;

}


}

export default connectDB;