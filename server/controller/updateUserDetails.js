const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {uploadImageToCloudinary} =require("../helpers/imageUploader")

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token;
    const user = await getUserDetailsFromToken(token);
let image = user?.profile_pic;
let userName=user?.name;

    if (!user || user.logout) {
      return res.status(401).json({
        success: false,
        message: user.message || "Unauthorized",
      });
    }

    const { name } = req.body;
    const profile_pic=req?.files?.profile_pic
    console.log()

    if(name){
      userName=name;
    }

if (profile_pic) {
  const response = await uploadImageToCloudinary(profile_pic, process.env.FOLDER_NAME);
  image=response?.secure_url

}

    await UserModel.findByIdAndUpdate(
      user._id,
      { name:userName,
         profile_pic:image
         },
      { new: true, runValidators: true }
    );

    const userInfo = await UserModel.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: userInfo,
    });

  } catch (error) {
    console.log("Error in updating user details:", error);
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
}

module.exports = updateUserDetails;
