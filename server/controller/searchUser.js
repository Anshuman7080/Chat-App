const UserModel=require("../models/UserModel")
async function searchUser(req, res) {
    try {
       
        const { search } = req.body; 
        const query = new RegExp(search,"i","g");    
        const user = await UserModel.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password")

        return res.status(200).json({
            success: true,
            data: user,
            message: "User fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false
        });
    }
}

module.exports=searchUser