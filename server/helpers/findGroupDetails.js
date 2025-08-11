const GroupModel = require("../models/GroupModel");

const findGroupDetails=async (groupId,res)=>{

    try{
        const response=await GroupModel.findById(groupId).populate("members");
        return response;
    }
    catch(error){
        console.log("error in fetching group Details",error);
    }
}

module.exports=findGroupDetails