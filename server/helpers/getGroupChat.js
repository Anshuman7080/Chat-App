const Group = require("../models/GroupModel");

const  getGroupChat=async(groupName)=>{
try{
   
    const response= await  Group.findOne({name:groupName});
    console.log("response in getGroupChat is",response);

    return response
}
catch(error){
    
    console.log("error in fetching Group chat");
    console.log("error is ",error);

}
}

module.exports = getGroupChat;
