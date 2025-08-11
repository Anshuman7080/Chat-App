
const { uploadImageToCloudinary } = require("../helpers/imageUploader");
const UserModel=require("../models/UserModel")
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
try{

const {name,email,password}=req.body;


const  profile_pic=req.files.profile_pic

if(!name || !email || !password){
    return res.status(400).json({
        success:false,
        message:"All fields are required",
    })
}




const checkEmail=await UserModel.findOne({email});

if(checkEmail){
    return res.status(400).json({
        success:false,
        message:"User is already registered"
    })
}

const profile_photo=await uploadImageToCloudinary(profile_pic,process.env.FOLDER_NAME)

const salt=await bcrypt.genSalt(10);

const hashedPassword=await bcrypt.hash(password,salt);

const user=await UserModel.create({
    name,
    email,
    password:hashedPassword,
    profile_pic:profile_photo.secure_url,
})

return res.status(201).json({
    success:true,
    message:"User registered Successfully",
   data:user,
})


}
catch(error){
    console.log("error in registering user");
    return res.status(500).json({
        messgae:error.message || error,
        success:false
    })
}	
}


module.exports=registerUser;