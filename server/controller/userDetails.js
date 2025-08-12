const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(req, res) {
  try {
   


    const token =

      req.cookies?.token ||
      req.body?.token ||
      req.headers?.authorization?.split(" ")[1] ||
      "";

   

    const user = await getUserDetailsFromToken(token);

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("error in fetching user Details:", error);
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
}

module.exports = userDetails;
