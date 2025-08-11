const UserModel=require("../models/UserModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
async function checkPassword(req,res){
    try{
      console.log("req body",req.body);
         const {password,userId}=req.body;

    if(!password  || !userId){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        })
    }

         const user=await UserModel.findById(userId);

         if(!user){
             return res.status(404).json({
                 success:false,
                 message:"User not found"
             });
         }

         const isMatch = await bcrypt.compare(password, user.password);
         if(!isMatch){
             return res.status(401).json({
                 success:false,
                 message:"Invalid password"
             });
         }
         
const tokenData={
    id:user._id,
    email:user.email,
}
         const token= await JWT.sign(
             tokenData,
             process.env.JWT_SECRET,
             {expiresIn:"30d"}
         );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        }

         return res.cookie("token", token, cookieOptions).status(200).json({
             success:true,
             message:"Password is correct",
             token:token,
         });

    }
    catch(error){
        console.log("error in checking password");
        return res.status(500).json({
            success:false,
            message:error.message || error,

        })
    }

    }
  
module.exports = checkPassword;