const GroupModel = require("../models/GroupModel");
const { uploadImageToCloudinary } = require("../helpers/imageUploader");

async function updateGroupDetails(req, res) {
  try {
    const { name = "", groupId } = req.body;
    const imageFile = req.files?.profile_pic;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required",
      });
    }

    const groupDetails = await GroupModel.findById(groupId);
    if (!groupDetails) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    let profile_pic = groupDetails.profile_pic;
    let groupName = groupDetails.name;

    if (imageFile) {
      const uploadResponse = await uploadImageToCloudinary(imageFile, process.env.FOLDER_NAME);
      if (uploadResponse?.secure_url) {
        profile_pic = uploadResponse.secure_url;
      }
    }

    if (name.trim()) {
      groupName = name.trim();
    }

    const updatedGroup = await GroupModel.findByIdAndUpdate(
      groupId,
      {
        name: groupName,
        profile_pic: profile_pic,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Group Details Updated Successfully",
      data: updatedGroup,
    });

  } catch (error) {
    console.error("Error updating group details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = updateGroupDetails;
