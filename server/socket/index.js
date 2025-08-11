const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const { ConversationModel,MessageModel } = require("../models/ConversationModel");
const getconversation = require("../helpers/getConversation");
const getGroupChat=require("../helpers/getGroupChat");
const GroupModel = require("../models/GroupModel");
const app = express();
const server = http.createServer(app);
const findGroupDetails=require("../helpers/findGroupDetails");
const groupConversationModel = require("../models/groupConversationModel");
const getAllGroups = require("../helpers/getAllGroups");

const io = new Server(server, {
  cors: {
    origin:'https://chat-app-frontend-15p0.onrender.com',
    credentials: true,
  },
});
 // cors: {
 //    origin: process.env.FRONTEND_URL || "http://localhost:3000",
 //    credentials: true,
 //  },

const onlineUser=new Set();
const onlineUserOfGroup = new Map();

io.on("connection", async (socket) => {
  console.log("user connected", socket.id);
// In Socket.IO (and WebSockets in general), a handshake 
// is the initial process where the client and server establish
//  a connection and agree on how they’ll communicate.
  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFromToken(token);

     //create a room
     socket.join(user?._id?.toString());
     onlineUser.add(user?._id?.toString());
       onlineUserOfGroup.set(user?._id.toString(), socket?.id);
     io.emit('onlineUser',Array.from(onlineUser))
     
      socket.on('message-page',async(userId)=>{
        console.log("coming in msg page",userId)
        const userDetails=await UserModel.findById(userId).select("-password");
        const payload={
            _id:userDetails?._id,
            name:userDetails?.name,
            email:userDetails?.email,
            profile_pic:userDetails?.profile_pic,
            online:onlineUser.has(userId)
        }
        socket.emit("message-user",payload)



        // get previous message
  //get previous message
         const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : user?._id, receiver : userId },
                { sender : userId, receiver :  user?._id}
            ]
        }).populate('messages').sort({ updatedAt : -1 })

        socket.emit('message',getConversationMessage?.messages || [])


      })  



      // new message

      socket.on('new-message',async(data)=>{
        //check conversation is availabel between both user
let conversation=await ConversationModel.findOne({
  "$or":[
    {sender:data?.sender,receiver:data?.receiver},
    {sender:data?.receiver,receiver:data?.sender}
  ]
})
// if conversation is not present
// console.log("conversation",conversation);
if(!conversation){
const createConversation=await ConversationModel({
  sender:data?.sender,
  receiver:data?.receiver
})
conversation=await createConversation.save();
}

// console.log("conversation",conversation);
//         console.log("new-message",data);


const message=new MessageModel({
  text:data?.text,
  imageUrl:data?.imageUrl,
  videoUrl:data?.videoUrl,
  msgByUserId:data?.sender
})

const saveMessage=await message.save();
const updateConversation =await ConversationModel.updateOne({_id:conversation?._id},{
  "$push":{messages:saveMessage?._id}
})

const getConversationMessage=await ConversationModel.findOne({
   "$or":[
    {sender:data?.sender,receiver:data?.receiver},
    {sender:data?.receiver,receiver:data?.sender}
  ]
}).populate("messages").sort({updatedAt:-1});

// console.log("getconversation",getConversationMessage)

io.to(data?.sender).emit("message",getConversationMessage?.messages || []);
io.to(data?.receiver).emit("message",getConversationMessage?.messages || []);

const conversationSender=await getconversation(data?.sender);
const conversationReceiver=await getconversation(data?.receiver);

io.to(data?.sender).emit("conversation",conversationSender);
io.to(data?.receiver).emit("conversation",conversationReceiver);


      })


//sidebar

socket.on("sidebar",async(currentUserId)=>{
  console.log("current user",currentUserId);

  const conversation= await getconversation(currentUserId);
  // console.log("response",conversation);
 socket.emit("conversation",conversation);

})



socket.on("seen",async(msgByUserId)=>{
  let conversation = await ConversationModel.findOne({
    "$or" : [
      {sender : user?._id ,receiver :msgByUserId},
      {sender : msgByUserId,receiver : user?._id},
    ]
  })

const conversationMessageById=conversation?.messages || []


const updateMessages=await MessageModel.updateMany(
  {_id : {"$in" : conversationMessageById},msgByUserId:msgByUserId},
  {"$set": {seen:true}}
)
// send conversation
const conversationSender=await getconversation(user?._id?.toString())
const conversationReceiver=await  getconversation(msgByUserId)

io.to(user?._id?.toString()).emit("conversation",conversationSender)
io.to(msgByUserId).emit("conversation",conversationReceiver)

})


socket.on("group-seen", async (currentUserId) => {
  try {
    const groupConversation = await groupConversationModel.findOne({
      participants: currentUserId
    }).populate("group");

    if (!groupConversation) return;

    const messageOfGroup = groupConversation.messages || [];

    if (messageOfGroup.length === 0) return;

    await MessageModel.updateMany(
      {
        _id: { $in: messageOfGroup },
        msgByUserId: { $ne: currentUserId }
      },
      { $set: { seen: true } }
    );




  } catch (error) {
    console.error("Error in group-seen handler:", error);
  }
});





socket.on("all-group-chat",async(userId)=>{
  console.log("all groupChat",userId);
  const allGroups=await getAllGroups(userId);
  // console.log("all groups",allGroups)
  socket.emit("all-group",allGroups);
})





// group conversation

socket.on("Create-group", async (data) => {

  const response =await getGroupChat(data?.groupName);

         if(response){
          socket.emit("Invalid-Group-Name",response);
         }else{
          

const newGroup= new GroupModel({
  name:data?.groupName,
    members:data?.groupMembers,
    admin:data?.admin ,
    conversation:null
})
const saveNewGroup=await newGroup.save();
console.log("saveNewGroup",saveNewGroup)
const newGroupResponse=await getGroupChat(data?.groupName);
if(newGroupResponse){
  socket.emit("new-group",newGroupResponse);
       const allGroups=await getAllGroups(data?.admin);
  // console.log("all groups",allGroups)
  socket.emit("all-group",allGroups);
}

         }
});
   


socket.on("Group-message-page",async(groupId)=>{
  socket.join(groupId);
  const response=await findGroupDetails(groupId);
  socket.emit("group-details",response);
  // send previous Message of group

   const groupNewMessage = await groupConversationModel
  .findOne({ group: groupId })
  .populate({
    path: "messages",
    populate: {
      path: "msgByUserId", // or whatever field holds the user reference
      model: "User",  // replace with your actual user model name
    },
  })
  .populate("participants");

//  console.log("groupNewMessage",groupNewMessage?.messages);
// console.log('groupId',groupId)

io.to(groupId).emit("groupMessageUpdate", groupNewMessage?.messages);

})


socket.on("group-message", async (data) => {
  const { groupId, userId, content } = data;
  // console.log("groupId",groupId);

   if (!content?.sender) {
    console.warn("Missing sender in content:", content);
    return;
  }
// console.log("data in groupMessage",data);

  let groupConversation = await groupConversationModel.findOne({group:groupId});
  // console.log("groupConverarion check",groupConversation)

  // console.log("if group convesation is present",groupConversation)
  // Fetch group details
  const groupDetail = await findGroupDetails(groupId);
  // console.log("group detais",groupDetail)

  if (!groupConversation) {
    const newGroupConversation = new groupConversationModel({
      name: groupDetail?.name,
      participants: groupDetail?.members,
      lastSender: userId,
      group:groupId,
       messages: []
    });

    groupConversation = await newGroupConversation.save();

    // console.log("groupConversation",groupConversation);
  }


    // const groupConversationForCheck = await groupConversationModel.findById(groupConversation?._id);

    // console.log(" new groupConversation is",groupConversationForCheck);

  // Now you can create and emit the message
const GroupMessage=new MessageModel({
  text:content?.text,
  imageUrl:content?.imageUrl,
  videoUrl:content?.videoUrl,
  msgByUserId:content?.sender
})

const saveGroupMessage=await GroupMessage.save();
// console.log("save groupMessage",saveGroupMessage)

   // 🔄 Update groupConversation with new message
  const saveNewMessage=await groupConversationModel.findByIdAndUpdate(
    groupConversation._id,
    {
      $push: { messages: saveGroupMessage._id },
      $set: { lastSender: userId },
      $set: {lastMessage:  saveGroupMessage._id }
    },
    { new: true }
  );

  // console.log("save new message",saveNewMessage)
  const updatedUserConversation = await GroupModel.findByIdAndUpdate(
    groupId,
    {
      $set: { conversation: saveNewMessage?._id }
    }
  )
  // console.log("save new message",saveNewMessage);
  // console.log("updated Conversation ",updatedUserConversation);


  const groupNewMessage = await groupConversationModel
  .findOne({ group: groupId })
  .populate({
    path: "messages",
    populate: {
      path: "msgByUserId", // or whatever field holds the user reference
      model: "User",  // replace with your actual user model name
    },
  })
  .populate("participants");

//  console.log("groupNewMessage",groupNewMessage?.messages);
// // console.log('groupId',groupId)
// console.log("groupNewMessage",groupNewMessage)

io.to(groupId).emit("groupMessageUpdate", groupNewMessage?.messages);

// const allGroups=await getAllGroups(userId);
//   // console.log("all groups",allGroups)
//  io.to(groupId).emit("all-group",allGroups);

const group = await GroupModel.findById(groupId).populate("members");

for (const member of group.members) {
  const memberId = member._id.toString();
  const socketId = onlineUserOfGroup.get(memberId);
  if (socketId) {
    const memberGroups = await getAllGroups(memberId);
    io.to(socketId).emit("all-group", memberGroups);
  }
}




});

   


 socket.on("disconnect", () => {
    onlineUser.delete(user?._id)
    onlineUserOfGroup.delete(user?._id?.toString());
    console.log("user disconnected", socket.id);
  });
});

module.exports = {
  app,
  server,
};
