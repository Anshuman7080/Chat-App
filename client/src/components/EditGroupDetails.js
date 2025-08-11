import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Divider from './Divider'
import { updateUserDetails } from '../services/operations/UserApi'
import { updateGroupDetails } from '../services/operations/groupAPI'

const EditGroupDetails = ({groupDetails,onClose}) => {

    const [data,setData]=useState({
        name:groupDetails?.name,
        profile_pic:groupDetails?.profile_pic
        
    })
    const [previewImage,setPreviewImage]=useState(null);
    const image=previewImage ? previewImage : groupDetails?.profile_pic;
    
    const navigate=useNavigate();
    const dispatch=useDispatch();

useEffect(()=>{
    setData((prev)=>{
       return {
         ...prev,
        ...groupDetails
       }

    })
},[groupDetails])

    const handleOnChange=(e)=>{
        const {name,value}=e.target;
        setData((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })
        }
       

          const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    const name = e.target.name;
               previewFile(file);
    if (file && name) {
      setData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const previewFile=(file)=>{
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      setPreviewImage(reader.result);
    }
  }

 const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
     const formData = new FormData();
formData.append("name", data.name);
formData.append("profile_pic", data.profile_pic); 
formData.append("groupId",groupDetails?._id)

 const response=await dispatch(updateGroupDetails({ formData, navigate }));
if(response?.data?.success){
  onClose();
  setData(prev=>({
    name:"",
    email:"",
  })); 
//  navigate(`/group/${groupDetails?._id}`); 
}


  };


  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700  bg-opacity-40 flex justify-center items-center z-50 ">
    <div className="bg-white p-4 py-6 m-1 w-full max-w-sm">
        <h2 className="font-semibold">Group Details</h2>
        <p className="text-sm">Edit Group Details</p>
        
        <form className="grid gap-3 mt-3 " onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <label htmlFor='name'>Name:</label>
                <input 
                    type="text"
                    name="name"
                    id="name"
                    value={data?.name}
                    onChange={handleOnChange}
                    className='w-full py-1 px-2 focus:outline-primary border border-0.5 '
                />
            </div>

                  <div>
                      <div>Photo:</div>
                    <div className="my-1 flex item-center gap-4">
                        <Avatar
                            width={40}
                            height={40}
                            imageUrl={image}
                            name={data?.name}
                        />
                                    <label htmlFor="profile_pic" className="cursor-pointer font-semibold">
                                  Change Photo
                        <input 
                        type="file"
                            className="hidden "
                             id="profile_pic"
                            name="profile_pic"
                            onChange={handleUploadPhoto}
                        />
                        </label>
                    </div>
                  </div>
                  
                  <Divider/>

                  <div className="flex gap-2 w-fit ml-auto ">
                    <button onClick={onClose} className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white">Cancel</button>
                    <button type="submit" className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary">Save</button>
                  </div>

        </form>

    </div>
    
    </div>
  )
}

export default EditGroupDetails
