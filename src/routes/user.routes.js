import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {uploadMulter}  from "../middlewares/multer.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";

const router=Router();


router.route("/register").post(
    
    uploadMulter.fields([
       {
        name:"avatar",
        maxCount:1
       },
       {
        name:"coverImage",
        maxCount:1  
       }
    ]),registerUser)

router.route("/login").post(loginUser)

// secure routes 

router.route("/logout").post( verifyJWT,  logoutUser)



export default router