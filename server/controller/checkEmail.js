const UserModel = require("../models/UserModel");

async function checkEmail(req, res) {

    try {
       
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email field is missing in request body"
            });
        }
    

        const user = await UserModel.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not Registered"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Email is Verified",
            data: user
        });

    } catch (error) {
        console.error("Error in checking email:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}


module.exports = checkEmail;
