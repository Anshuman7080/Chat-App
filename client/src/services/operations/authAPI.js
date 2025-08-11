import { endpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import toast from "react-hot-toast";
import { logOut, setSignupData } from "../../slices/auth";

const {
   REGISTER_API,
  VERIFY_EMAIL,
  VERIFY_PASSWORD,
  USER_DETAILS
 } = endpoints;

export function registerUser(formData, navigate) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("POST", REGISTER_API, formData, {
        "Content-Type": "multipart/form-data",
      });

      console.log("response from registering user", response);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Registration failed.");
      }

      toast.success("User registered successfully");

      navigate("/checkEmailPage");
    } catch (error) {
      console.log("register user error:", error);
      toast.error(error.message || "Something went wrong during registration.");
    }
  };
}


export function checkEmailOfUser(formData,navigate){
  return async(dispatch)=>{
    try{
  
      const response = await apiConnector("POST",VERIFY_EMAIL,formData);

       console.log("response from email verification",response);
      if(!response?.data.success){
        throw new Error (response?.data?.message);
      }
            
      toast.success("Email Verified");

       dispatch(setSignupData({...response.data.data}));
      console.log("user data is", response.data.data);

   
      navigate("/checkPasswordPage")

    }
    catch(error){
      console.log("error in verifying email");
      toast.error(error.message  ||  "error in verifying email");
    }
  }
}



export function checkPasswordOfUser(formData,navigate){
return async(dispatch)=>{
  try{

    const response=await apiConnector("POST",VERIFY_PASSWORD,formData);

    console.log("password verification result....",response);

    if(!response?.data?.success){
      throw new Error( response?.data?.message);
    }
 

    localStorage.setItem("token",response?.data?.token)
    toast.success("Password Verified");

    navigate("/");

  }
  catch(error){
    console.log("error while verifying the password",error);
    toast.error(error.message || "error while password verification")
  }
}
}

