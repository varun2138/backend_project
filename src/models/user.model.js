import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
      username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true 
      },
     fullName:{
        type:String,
        required:true,
        trim:true,
        index:true          
     },
     avatar:{
        type:String,//cloudinary url
         required:true  
     },
     coverImage:{
        type:String //cloudinary url
     },
     watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],    
    password:{
        type:String,
        required:[ true,"Password is required"],
        
     },
     refreshToken:{
        type:String
     }

 

},{timestamps:true});





 userSchema.pre("save",async function(next){
   //the condition checks if the password is not modified , and moves to next();
   if(!this.isModified("password")) return next();
   // and the password is encrypted if the above condition fails
   this.password=bcrypt.hash(this.password,10);
   next()
 })

 //method to check password is correct or not
userSchema.methods.isPasswordCorrect= async function (password){
  return  await bcrypt.compare(password,this.password)
}






//method for generating access token
 userSchema.methods.generateAccessToken=function(){
 return  jwt.sign(
      {
         _id:this._id,
         username:this.username,
         email:this.email,
         fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
   )
 }

 //method for generating refresh token

 userSchema.methods.generateRefreshToken=function(){
   return jwt.sign(
      { _id:this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
   )
 }
export const User=mongoose.model("User",userSchema);