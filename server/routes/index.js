const express = require("express");
const router = express.Router();

const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const checkPassword=require("../controller/checkPassword.js");
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser.js");
const getAllUsers=require("../controller/getAllUsers.js")
const updateGroupDetails=require("../controller/updateGroupDetails.js");
// Handle user registration
router.post("/register", registerUser);

// Check email verification
router.post("/check-email", checkEmail);
 
//check password

router.post("/check-password", checkPassword);

router.post("/user-details",userDetails);
router.get("/logout",logout)
router.post("/update-user",updateUserDetails)
router.post("/search-user",searchUser);
router.get("/search-all-users",getAllUsers);
router.post("/updateGroupDetails",updateGroupDetails);
module.exports = router;
