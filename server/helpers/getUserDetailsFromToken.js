const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
        
      message: "Session Expired",
      logout: true,
    };
  }

  try {


    const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decodedToken.id).select("-password");

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;

  } catch (error) {
      console.log("error in getting user detail from token",error.message);
    return {
      message: "Invalid or expired token",
      logout: true,
    };
  }
};

module.exports = getUserDetailsFromToken;
