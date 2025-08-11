const { ConversationModel } = require("../models/ConversationModel");
const {groupConversationModel} = require("../models/groupConversationModel");

const getGroupConversation=async(currentUserId)=>{
    if(currentUserId){
          const currentUserConversation=await groupConversationModel.find({
              participants:currentUserId
          }).sort({updatedAt : -1}).populate("messages").populate("sender").populate("receiver");
        
            const conversation=currentUserConversation.map((conv)=>{
              const countUnseenMsg=conv.messages.reduce((prev ,curr) => {
                if(curr?.msgByUserId?.toString()!== currentUserId){
                 return  prev+(curr.seen ? 0 : 1)
                }else{
                  return prev;
                }
              },0);
              return {
                _id:conv?._id,
                sender:conv?.sender,
                receiver:conv?.receiver,
                unseenMsg:countUnseenMsg,
                lastMsg:conv.messages[conv?.messages?.length-1]
              }
            })

            console.log("conversation for seen of group",conversation);
        
            return conversation
        //   socket.emit("conversation",conversation);
    }else{
        return [];
    }
}

module.exports=getGroupConversation