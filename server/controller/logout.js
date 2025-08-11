

async function logout(req,res){
    try{
   const cookieOptions = {
            httpOnly: true,
            secure: true,
        }

           return res.cookie("token", "", cookieOptions).status(200).json({
            success:true,
            message:"Session Out "
           })
    }
    catch(error){
        console.log("error while logout",error);
 return res.status(500).json({
    success:false,
    message:error.message || error
 })
    }
}

module.exports= logout