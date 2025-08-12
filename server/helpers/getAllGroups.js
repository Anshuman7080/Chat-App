const GroupModel = require("../models/GroupModel");

const getAllGroups = async (currentUserId) => {
  try {
    console.log("current user id", currentUserId);

    const groups = await GroupModel.find({
      members: currentUserId
    }).populate("conversation");

   
    const sortedGroups = groups.sort((a, b) => {
      const aTime = a.conversation?.updatedAt ? new Date(a.conversation.updatedAt).getTime() : 0;
      const bTime = b.conversation?.updatedAt ? new Date(b.conversation.updatedAt).getTime() : 0;
      return bTime - aTime;
    });

    // console.log("Sorted Groups:", sortedGroups);
    return sortedGroups;
  } catch (error) {
    console.log("Error in getting all the groups", error);
    return [];
  }
};

module.exports = getAllGroups;
