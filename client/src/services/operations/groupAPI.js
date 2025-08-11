import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import toast from "react-hot-toast";

const {UPDATEGROUPDETAILS}=endpoints
export function updateGroupDetails({formData,navigate}){

  
    return async(dispatch)=>{
        try{

            const response=await apiConnector("POST",UPDATEGROUPDETAILS,formData);
            console.log("response from update group Details",response);
               if(!response?.data?.success){
                toast.error(response?.data?.message);
          }
            toast.success("Details Updated Successfully");
            return response;

        }
        catch(error){
            console.log("error in updating Group Details",error);
        }
    }
}