
import { endpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import toast from "react-hot-toast";
import { logOut, setSignupData } from "../../slices/auth";

const {
  USER_DETAILS,
  UPDATE_USER_DETAILS,
  FIND_USER,
  FIND_ALL_USERS
 } = endpoints;

export function fetchDetailsOfUser(navigate, token) {
  console.log("token is ", token);
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "POST", 
        USER_DETAILS,
        { token }, 
        { Authorization: `Bearer ${token}` } 
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      if (response?.data?.data?.logout) {
        toast.error("Session Expired");
        dispatch(logOut());
        navigate("/checkEmailPage");
      }
    } catch (error) {
      console.log("Error while fetching user Details....", error);
      toast.error(error.message);
    }
  };
}


export function updateUserDetails(formData,navigate){
    return async (dispatch)=>{
        try{
          const response=await apiConnector("POST",  UPDATE_USER_DETAILS,formData);
                 console.log("response of updating user details....",response);
          if(!response?.data?.success){
                toast.error(response?.data?.message);
          }

          dispatch(setSignupData({...response?.data?.data}));
                toast.success("Details Updated Successfully");
                return response;
        }
        catch(error){
            console.log("error in updating user details.....",error)
            toast.error("Could not update user Details");
        }
    }
}


export function searchUserByEmailOrName(search){

    return async(dispatch)=>{
  
     try{
      
      const response= await apiConnector("POST",FIND_USER,search);
       
      console.log("response from searching user",response);
      if(!response?.data?.success){
                 toast.error(response?.data?.message);
      }
       

        toast.success("User Details fetched Successfully");
        
        return response;

     }
      catch(error){
        console.log("error in fetching user....",error);
        console.log(error.message);
        toast.error(error.message);
      }
  }
}

export async function fetchAllTheUsers(){
try{
  const response=await  apiConnector("GET",FIND_ALL_USERS);
  console.log("response from fetch all users",response);

  if(!response?.data?.success){
  toast.error(response?.data?.message);
  }

  return response;


}
catch(error){
  console.log("error while fetching all the users",error);
  toast.error(error.message || "could not fetch all users")
}
}
