
import mongoose , { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const userSchema = new Schema(

    {
          username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
          },

          email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            
          },

          fullname: {
            type: String,
            required: true,
            trim: true,
        
          },

          avatar :{
            type: String,  // cloudinary url
            required: true, 
          },

             coverImage :{
            type: String,  // cloudinary url
        
          },


          watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:'Video',
            }
          ],

          password:{
            type:String,
            required:[true,'Please provide a password'],
          },
        
           refreshToken:{
            type:String,    
           }

    } , { timestamps: true }  

 );

  
  // It hashes (encrypts) the password before saving it in the database.

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))  return next();
           this.password = await bcrypt.hash(this.password, 10);
      return next();
    
    })

         //  It checks if a user’s entered password is correct when logging in.

      userSchema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password, this.password);
      } 

        userSchema.methods.generateAccessToken = function () {
        
          const accessToken = jwt.sign(
            { 
           // payload data (name) : data coming from database   
              userId: this._id ,
               email:this.email
          
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
            }

            
          ) 
             return accessToken;
          }
          
          userSchema.methods.generateRefreshToken = function () {
            const refreshToken = jwt.sign(
               { 
           // payload data (name) : data coming from database   
              userId: this._id ,
               email:this.email
          
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
            }
            
               ) 
        
            return refreshToken;
            }




export const User = mongoose.model('User', userSchema);