const UserModel = require("../models/UserModel");

async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({});
    

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error in getAllUsers:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports= getAllUsers